import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Protocol } from '../protocol/protocol.entity'
import { CheckProtocolChangeDto } from './dtos/check-change-protocol.dto'
import { MedicalRecord } from './medical-record.entity'
import { IMedicalRecord, IProtocolChange, IRecord } from './medical-record.interface'
import { ClassifyQuestion } from '../classify-question/classify-question.entity'
import { IAnswer, IQuestion } from '../classify-question/classify-question.interface'
import { formatArrayToObject, validateEmail } from 'src/common/utils'
import {
  CreateMedicalRecordDto,
  CreateMedicalRecordDtoV2,
  SubmitDoctorDto,
  SubmitPatientDto,
} from './dtos/create-medical-record.dto'
import { RecordLevel } from 'src/constants/record-level.enum'
import { paginate } from 'src/common/pagination'
import { PaginateMedicalRecordDto } from './dtos/paginate-medical-record.dto'
import { Doctor } from '../doctor/doctor.entity'
@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Protocol)
    private readonly protocolRepository: Repository<Protocol>,
    @InjectRepository(ClassifyQuestion)
    private readonly classifyQuestionRepository: Repository<ClassifyQuestion>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  // Hàm kiểm tra chuyển giao thức
  async checkProtocolChange(checkProtocolChangeDto: CheckProtocolChangeDto): Promise<IProtocolChange[]> {
    const { protocol_code, question_answer } = checkProtocolChangeDto

    const protocol = await this.protocolRepository
      .createQueryBuilder('protocols')
      .where('protocols.protocol_code = :protocol_code', { protocol_code })
      .getOne()

    if (!protocol) {
      throw new NotFoundException('Protocol not found')
    }

    const classifyQuestion = await this.classifyQuestionRepository
      .createQueryBuilder('classify_questions')
      .select(['classify_questions.questions', 'classify_questions.protocol_code'])
      .where('classify_questions.protocol_code = :protocol_code', { protocol_code })
      .getOne()

    if (!classifyQuestion) {
      throw new NotFoundException('Classify question not found')
    }
    const questions: IQuestion[] = classifyQuestion.questions || []
    const protocolCodeChangeList: number[] = []

    const questionAnswerResult = formatArrayToObject(question_answer, 'id')
    const questionAnswerDB = formatArrayToObject(classifyQuestion.questions, 'id')

    for (const question of questions) {
      // Nếu user không trả lời câu hỏi này thì bỏ qua
      if (!questionAnswerResult[question.id] || !questionAnswerResult[question.id].answer) {
        continue
      }
      const answerResult = questionAnswerResult[question.id].answer // A B C D
      const answerDBs: IAnswer[] = questionAnswerDB[question.id].answer // mảng ans IAnswer[]
      const answerDBObject = formatArrayToObject(answerDBs, 'option') // obj ans key là  A B C D

      const answerDB = answerDBObject[answerResult]
      if (answerDB && answerDB.change_protocol) {
        protocolCodeChangeList.push(answerDB.change_protocol)
      }
    }

    if (protocolCodeChangeList.length > 0) {
      const protocolChangeList: IProtocolChange[] = await this.protocolRepository
        .createQueryBuilder('protocols')
        .select(['protocols.protocol_code', 'protocols.id'])
        .where('protocols.protocol_code IN (:...protocol_codes)', {
          protocol_codes: protocolCodeChangeList,
        })
        .getMany()

      return protocolChangeList
    }

    return []
  }

  // viết submit medical record theo form CreateMedicalRecordDto và check tất cả các case có thể xảy ra
  async submitMedicalRecord(
    submitMedicalRecordDto: CreateMedicalRecordDto,
  ): Promise<{ level_system: string }> {
    const { doctor, records } = submitMedicalRecordDto

    const isExistProtocol = await this.protocolRepository
      .createQueryBuilder('protocols')
      .select(['protocols.protocol_code'])
      .where('protocols.protocol_code IN (:...protocol_codes)', {
        protocol_codes: records.map(record => record.protocol_code),
      })
      .getMany()

    if (isExistProtocol.length !== records.length) {
      throw new NotFoundException('Some protocol not found')
    }
    const isExistProtocolCode = isExistProtocol.map(protocol => protocol.protocol_code)

    const isExistClassifyQuestion = await this.classifyQuestionRepository
      .createQueryBuilder('classify_questions')
      .select(['classify_questions.protocol_code', 'classify_questions.questions'])
      .where('classify_questions.protocol_code IN (:...protocol_codes)', {
        protocol_codes: isExistProtocolCode,
      })
      .getMany()

    if (isExistClassifyQuestion.length !== records.length) {
      throw new NotFoundException('Some classify question not found')
    }

    // Định nghĩa thứ tự ưu tiên của các màu
    const colorPriority = ['Blue', 'Purple', 'Red', 'Orange', 'Yellow', 'Green']

    // Hàm lấy bậc cao nhất từ danh sách màu
    function getHighestLevelColor(colors: (string | null | undefined)[]): string | null {
      for (const color of colorPriority) {
        if (colors.includes(color)) {
          return color
        }
      }
      return null
    }

    const classifyQuestionsDB = formatArrayToObject(isExistClassifyQuestion, 'protocol_code')
    const classifyQuestionSubmit = formatArrayToObject(records, 'protocol_code')

    let levels: string[] = []
    for (const record of records) {
      const classifyQuestion = classifyQuestionsDB[record.protocol_code].questions
      const questionAnswer = classifyQuestionSubmit[record.protocol_code].question_answer

      const questionAnswerResult = formatArrayToObject(questionAnswer, 'id')
      const questionAnswerDB = formatArrayToObject(classifyQuestion, 'id')

      for (const qId in questionAnswerResult) {
        const userAnswer = questionAnswerResult[qId]?.answer
        const questionInDB: IAnswer[] = questionAnswerDB[qId].answer
        const questionInDBObject = formatArrayToObject(questionInDB, 'option')
        if (!questionInDB) continue

        // Tìm đáp án trong DB trùng với đáp án user gửi lên
        const matchedAnswer = questionInDBObject[userAnswer]
        if (matchedAnswer) {
          levels.push(matchedAnswer.level)
        }
      }
    }
    const highestLevel = getHighestLevelColor(levels)

    const medicalRecord = this.medicalRecordRepository.create({
      doctor: doctor || null,
      records,
      level_system: highestLevel as any,
    })

    await this.medicalRecordRepository.save(medicalRecord)

    return {
      level_system: highestLevel,
    }
  }

  async submitMedicalRecordV2(submitMedicalRecordDto: CreateMedicalRecordDtoV2, id?: number): Promise<any> {
    // id là protocol_code
    const {
      doctor,
      patient,
      protocol_code, // là id của record trước đó
      code,
      resultQandA,
      note,
      protocol_before,
      level_doctor,
      medical_advice,
    } = submitMedicalRecordDto

    // code phải có khi tạo mới
    if (!code && !protocol_before) {
      throw new BadRequestException('Code is required')
    }
    // kiểm tra mã bênh án đã tồn tại
    if (code) {
      const isExistCode = await this.medicalRecordRepository
        .createQueryBuilder('medical_records')
        .select(['medical_records.code'])
        .where('medical_records.code = :code', { code })
        .getOne()

      if (isExistCode) {
        throw new BadRequestException('Code already exists')
      }
    }
    // nếu có patient thì name không được để trống
    if (patient && !patient.name) {
      throw new BadRequestException('Patient name is required')
    }
    // protocol_before không được tồn tại khi tạo mới
    // if (protocol_before && !id) {
    //   throw new BadRequestException('protocol_before should not exist')
    // }
    // kiểm tra protocol_before
    if (protocol_before) {
      const isExistProtocolBefore = await this.medicalRecordRepository
        .createQueryBuilder('medical_records')
        .select(['medical_records.id'])
        .where('medical_records.id = :id', { id: protocol_before })
        .getOne()

      if (!isExistProtocolBefore) {
        throw new NotFoundException('Protocol before not found')
      }
    }

    // Kiểm tra protocol code
    const isExistProtocol = await this.protocolRepository
      .createQueryBuilder('protocols')
      .select(['protocols.protocol_code'])
      .where('protocols.protocol_code = :protocol_code', { protocol_code })
      .getOne()

    console.log('isExistProtocol', isExistProtocol)
    if (!isExistProtocol) {
      throw new NotFoundException('Protocol not found')
    }

    // Kiểm tra classify question
    const isExistClassifyQuestion = await this.classifyQuestionRepository
      .createQueryBuilder('classify_questions')
      .select(['classify_questions.questions'])
      .where('classify_questions.protocol_code = :protocol_code', { protocol_code })
      .getOne()

    console.log('isExistClassifyQuestion', isExistClassifyQuestion)
    if (!isExistClassifyQuestion) {
      throw new NotFoundException('Classify question not found')
    }

    const levelMapping = {
      1: RecordLevel.Green,
      2: RecordLevel.Blue,
      3: RecordLevel.Yellow,
      4: RecordLevel.Red,
      5: RecordLevel.Purple,
      6: RecordLevel.Orange,
    }
    // Xác định màu cao nhất - change_protocol
    const colorPriority: RecordLevel[] = [
      RecordLevel.Green,
      RecordLevel.Yellow,
      RecordLevel.Orange,
      RecordLevel.Red,
      RecordLevel.Purple,
      RecordLevel.Blue,
    ]
    let highestLevel: RecordLevel = RecordLevel.Green
    let changeProtocols: number[] = []

    for (const question of resultQandA) {
      for (const answer of question.answer) {
        if (answer.change_protocol) {
          changeProtocols.push(answer.change_protocol)
        }
        if (colorPriority.indexOf(answer.level) > colorPriority.indexOf(highestLevel)) {
          highestLevel = answer.level
        }
      }
    }

    let protocolChangeList: IProtocolChange[] = []
    if (changeProtocols.length > 0) {
      protocolChangeList = await this.protocolRepository
        .createQueryBuilder('protocols')
        .select(['protocols.protocol_code', 'protocols.name'])
        .where('protocols.protocol_code IN (:...protocol_codes)', {
          protocol_codes: changeProtocols,
        })
        .getMany()
    }

    const levelMappingNumber = {
      [RecordLevel.Green]: 1,
      [RecordLevel.Blue]: 2,
      [RecordLevel.Yellow]: 3,
      [RecordLevel.Red]: 4,
      [RecordLevel.Purple]: 5,
      [RecordLevel.Orange]: 6,
    }

    const mappingLevelDoctor = levelMapping[level_doctor]
    if (protocol_before) {
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id: protocol_before },
      })
      if (!medicalRecord) {
        throw new NotFoundException('Medical record not found')
      }

      const newRecord: IRecord = {
        protocol_code: protocol_code,
        note: note,
        protocol_before: protocol_before,
        level_system: levelMappingNumber[highestLevel],
        level_doctor: level_doctor ? levelMappingNumber[mappingLevelDoctor] : null,
        question_answer: resultQandA,
      }
      await this.medicalRecordRepository.update(protocol_before, {
        code: code || medicalRecord.code,
        doctor: doctor || medicalRecord.doctor,
        patient: patient || medicalRecord.patient,
        medical_advice: medical_advice || medicalRecord.medical_advice,
        records: [...medicalRecord.records, newRecord],
      })
      return {
        id: protocol_before,
        code,
        records: newRecord,
        change_protocol: protocolChangeList.length > 0 ? protocolChangeList : undefined,
      }
    } else {
      const newRecord: IRecord = {
        protocol_code: protocol_code,
        note: note || null,
        protocol_before: protocol_before || null,
        level_system: levelMappingNumber[highestLevel],
        level_doctor: level_doctor ? levelMappingNumber[mappingLevelDoctor] : null,
        question_answer: resultQandA,
      }
      const medicalRecord = this.medicalRecordRepository.create({
        code,
        doctor: doctor || null,
        patient: patient || null,
        note: note || null,
        medical_advice: medical_advice || false,
        protocol_before: protocol_before || null,
        records: [newRecord],
        level_system: highestLevel,
        level_doctor: level_doctor ? levelMappingNumber[mappingLevelDoctor] : null,
      })
      const savedMedicalRecord = await this.medicalRecordRepository.save(medicalRecord)
      return {
        id: savedMedicalRecord.id,
        code,
        records: [newRecord],
        change_protocol: protocolChangeList.length > 0 ? protocolChangeList : undefined,
      }
    }
  }

  async submitPatient(submitPatientDto: SubmitPatientDto): Promise<any> {
    const { code, patient } = submitPatientDto

    if (!code) {
      throw new BadRequestException('Code is required')
    }

    const existCode = await this.medicalRecordRepository
      .createQueryBuilder('medical_records')
      .select(['medical_records.code'])
      .where('medical_records.code = :code', { code })
      .getOne()

    if (existCode) {
      throw new BadRequestException('Code already exists')
    }

    if (patient.email && !validateEmail(patient.email)) {
      throw new BadRequestException('Email is invalid')
    }
    if (!patient.name) {
      throw new BadRequestException('Name is required')
    }
    return {
      code,
      patient,
    }
  }

  async submitDoctor(submitDoctorDto: SubmitDoctorDto): Promise<any> {
    const { doctor } = submitDoctorDto

    if (doctor.email && !validateEmail(doctor.email)) {
      throw new BadRequestException('Email is invalid')
    }
    if (!doctor.name) {
      throw new BadRequestException('Name is required')
    }

    // Kiểm tra email đã tồn tại
    if (doctor.email) {
      const existDoctor = await this.doctorRepository.findOne({
        where: { email: doctor.email },
      })

      if (existDoctor) {
        throw new BadRequestException('Email already exists')
      }
    }

    const newDoctor = this.doctorRepository.create({
      ...doctor,
    })
    await this.doctorRepository.save(newDoctor)
    return {
      id: newDoctor.id,
      name: newDoctor.name,
      email: newDoctor.email,
      birth: newDoctor.birth,
      gender: newDoctor.gender,
      role: newDoctor.role,
    }
  }

  // get List Medical Record
  async getListMedicalRecord(paginateMedicalRecordDto: PaginateMedicalRecordDto): Promise<IMedicalRecord[]> {
    const medicalRecords = await this.medicalRecordRepository
      .createQueryBuilder('medical_records')
      .select([
        'medical_records.id',
        'medical_records.code',
        'medical_records.patient',
        'medical_records.doctor',
        'medical_records.level_system',
        'medical_records.level_doctor',
        'medical_records.medical_advice',
        'medical_records.records',
      ])

    const { data } = await paginate(medicalRecords, paginateMedicalRecordDto)
    const formatMedicalRecords: IMedicalRecord[] = await Promise.all(
      data.map(async medicalRecord => {
        // Lấy name của protocol_code
        const lastRecord = medicalRecord.records[medicalRecord.records.length - 1]
        const protocolName = await this.protocolRepository.findOne({
          where: { protocol_code: lastRecord.protocol_code },
        })

        return {
          id: medicalRecord.id,
          code: medicalRecord.code,
          patient: medicalRecord.patient,
          doctor: medicalRecord.doctor,
          medical_advice: medicalRecord.medical_advice,
          records: {
            protocol_code: lastRecord.protocol_code,
            protocol_name: protocolName.name,
            note: lastRecord.note,
            protocol_before: lastRecord.protocol_before,
            level_system: lastRecord.level_system,
            level_doctor: lastRecord.level_doctor,
          },
        }
      }),
    )

    return formatMedicalRecords
  }
  // lấy medical record theo id
  async getMedicalRecord(id: number): Promise<IMedicalRecord> {
    const medicalRecord = await this.medicalRecordRepository.findOne({
      where: { id },
    })
    if (!medicalRecord) {
      throw new NotFoundException('Medical record not found')
    }

    // Chỉ trả về record cuối cùng, không trả ra mảng
    const lastRecord = medicalRecord.records[medicalRecord.records.length - 1]
    const protocolName = await this.protocolRepository.findOne({
      where: { protocol_code: lastRecord.protocol_code },
    })
    const formatMedicalRecord: IMedicalRecord = {
      id: medicalRecord.id,
      code: medicalRecord.code,
      patient: medicalRecord.patient,
      doctor: medicalRecord.doctor,
      medical_advice: medicalRecord.medical_advice,
      records: {
        protocol_code: lastRecord.protocol_code,
        protocol_name: protocolName.name,
        note: lastRecord.note,
        protocol_before: lastRecord.protocol_before,
        level_system: lastRecord.level_system,
        level_doctor: lastRecord.level_doctor,
        question_answer: lastRecord.question_answer,
      },
    }
    return formatMedicalRecord
  }
}
