import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Protocol } from '../protocol/protocol.entity'
import { CheckProtocolChangeDto } from './dtos/check-change-protocol.dto'
import { MedicalRecord } from './medical-record.entity'
import { IMedicalRecord, IProtocolChange, IRecord } from './medical-record.interface'
import { ClassifyQuestion } from '../classify-question/classify-question.entity'
import { IAnswer, IQuestion } from '../classify-question/classify-question.interface'
import { formatArrayToObject } from 'src/common/utils'
import { CreateMedicalRecordDto, CreateMedicalRecordDtoV2 } from './dtos/create-medical-record.dto'
import { RecordLevel } from 'src/constants/record-level.enum'
import { paginate } from 'src/common/pagination'
import { PaginateMedicalRecordDto } from './dtos/paginate-medical-record.dto'

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,
    @InjectRepository(Protocol)
    private readonly protocolRepository: Repository<Protocol>,
    @InjectRepository(ClassifyQuestion)
    private readonly classifyQuestionRepository: Repository<ClassifyQuestion>,
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
    const {
      doctor,
      patient,
      protocol_code,
      code,
      resultQandA,
      note,
      protocol_before,
      level_doctor,
      medical_advice,
    } = submitMedicalRecordDto

    // code phải có khi tạo mới
    if (!code && !id) {
      throw new BadRequestException('Code is required')
    }
    // kiểm tra mã bênh án đã tồn tại
    const isExistCode = await this.medicalRecordRepository
      .createQueryBuilder('medical_records')
      .select(['medical_records.code'])
      .where('medical_records.code = :code', { code })
      .getOne()

    if (isExistCode) {
      throw new BadRequestException('Code already exists')
    }

    // nếu có patient thì name không được để trống
    if (patient && !patient.name) {
      throw new BadRequestException('Patient name is required')
    }
    // protocol_before không được tồn tại khi tạo mới
    if (protocol_before && !id) {
      throw new BadRequestException('protocol_before should not exist')
    }
    // kiểm tra protocol_before
    if (protocol_before) {
      const isExistProtocolBefore = await this.protocolRepository
        .createQueryBuilder('protocols')
        .select(['protocols.protocol_code'])
        .where('protocols.protocol_code = :protocol_code', { protocol_code: protocol_before })
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

    if (!isExistProtocol) {
      throw new NotFoundException('Protocol not found')
    }

    // Kiểm tra classify question
    const isExistClassifyQuestion = await this.classifyQuestionRepository
      .createQueryBuilder('classify_questions')
      .select(['classify_questions.questions'])
      .where('classify_questions.protocol_code = :protocol_code', { protocol_code })
      .getOne()

    if (!isExistClassifyQuestion) {
      throw new NotFoundException('Classify question not found')
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
        if (colorPriority.indexOf(answer.level) > colorPriority.indexOf(highestLevel)) {
          highestLevel = answer.level
          changeProtocols = [answer.change_protocol]
        } else if (answer.level === highestLevel) {
          changeProtocols.push(answer.change_protocol)
        }
      }
    }

    const protocolChangeList: IProtocolChange[] = await this.protocolRepository
      .createQueryBuilder('protocols')
      .select(['protocols.protocol_code', 'protocols.name'])
      .where('protocols.protocol_code IN (:...protocol_codes)', {
        protocol_codes: changeProtocols,
      })
      .getMany()

    if (id) {
      const medicalRecord = await this.medicalRecordRepository.findOne({
        where: { id },
      })
      if (!medicalRecord) {
        throw new NotFoundException('Medical record not found')
      }

      const newRecord: IRecord = {
        protocol_code: protocol_code,
        note: note,
        protocol_before: protocol_before,
        level_system: highestLevel,
        level_doctor: level_doctor,
        question_answer: resultQandA,
      }
      await this.medicalRecordRepository.update(id, {
        code: code || medicalRecord.code,
        doctor: doctor || medicalRecord.doctor,
        patient: patient || medicalRecord.patient,
        medical_advice: medical_advice || medicalRecord.medical_advice,
        records: [...medicalRecord.records, newRecord],
      })
      return {
        id,
        code,
        records: [...medicalRecord.records, newRecord],
        change_protocol: protocolChangeList.length > 0 ? protocolChangeList : undefined,
      }
    } else {
      const newRecord: IRecord = {
        protocol_code: protocol_code,
        note: note || null,
        protocol_before: protocol_before || null,
        level_system: highestLevel,
        level_doctor: level_doctor || null,
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
        level_doctor: level_doctor || null,
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
    const formatMedicalRecords: IMedicalRecord[] = data.map(medicalRecord => {
      return {
        id: medicalRecord.id,
        code: medicalRecord.code,
        patient: medicalRecord.patient,
        doctor: medicalRecord.doctor,
        medical_advice: medicalRecord.medical_advice,
        records: medicalRecord.records.map(record => ({
          protocol_code: record.protocol_code,
          note: record.note,
          protocol_before: record.protocol_before,
          level_system: record.level_system,
          level_doctor: record.level_doctor,
        })),
      }
    })
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

    const formatMedicalRecord: IMedicalRecord = {
      id: medicalRecord.id,
      code: medicalRecord.code,
      patient: medicalRecord.patient,
      doctor: medicalRecord.doctor,
      medical_advice: medicalRecord.medical_advice,
      records: medicalRecord.records.map(record => ({
        protocol_code: record.protocol_code,
        note: record.note,
        protocol_before: record.protocol_before,
        level_system: record.level_system,
        level_doctor: record.level_doctor,
        question_answer: record.question_answer,
      })),
    }
    return formatMedicalRecord
  }
}
