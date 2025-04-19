import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Protocol } from '../protocol/protocol.entity'
import { CheckProtocolChangeDto } from './dtos/check-change-protocol.dto'
import { MedicalRecord } from './medical-record.entity'
import { IProtocolChange } from './medical-record.interface'
import { ClassifyQuestion } from '../classify-question/classify-question.entity'
import { IAnswer, IQuestion } from '../classify-question/classify-question.interface'
import { formatArrayToObject } from 'src/common/utils'
import { CreateMedicalRecordDto } from './dtos/create-medical-record.dto'
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
}
