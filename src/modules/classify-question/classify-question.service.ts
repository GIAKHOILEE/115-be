import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ClassifyQuestion } from './classify-question.entity'
import { Protocol } from 'src/modules/protocol/protocol.entity'
import { CreateClassifyQuestionDto } from './dtos/create-classify-question.dto'
import { IClassifyQuestion, IQuestion } from './classify-question.interface'
import { PaginateClassifyQuestionDto } from './dtos/paginate-classify-question.dto'
import { paginate } from 'src/common/pagination'
import { UpdateClassifyQuestionDto } from './dtos/update-classify-question.dto'
@Injectable()
export class ClassifyQuestionService {
  constructor(
    @InjectRepository(ClassifyQuestion)
    private readonly classifyQuestionRepository: Repository<ClassifyQuestion>,

    @InjectRepository(Protocol)
    private readonly protocolRepository: Repository<Protocol>,
  ) {}

  async createClassifyQuestion(
    createClassifyQuestionDto: CreateClassifyQuestionDto,
  ): Promise<ClassifyQuestion> {
    const { protocol_code, questions } = createClassifyQuestionDto
    const protocol = await this.protocolRepository
      .createQueryBuilder('protocol')
      .select(['protocol.id', 'protocol.protocol_code', 'protocol.name'])
      .where('protocol.protocol_code = :protocol_code', { protocol_code })
      .getOne()
    if (!protocol) {
      throw new NotFoundException('Protocol not found')
    }

    const exitClassifyQuestion = await this.classifyQuestionRepository
      .createQueryBuilder('classify_question')
      .where('classify_question.protocol_code = :protocol_code', { protocol_code })
      .getOne()
    if (exitClassifyQuestion) {
      throw new BadRequestException('Classify question already exists')
    }

    const formatQuestions: IQuestion[] = questions.map((question, index) => ({
      id: index + 1,
      question: question.question,
      multiple_choice: question.multiple_choice,
      answer: question.answer.map((answer, index) => ({
        id: index + 1,
        option: answer.option,
        value: answer.value,
        level: answer.level,
        change_protocol: answer.change_protocol,
        priority: answer.priority,
      })),
    }))

    const classifyQuestion = this.classifyQuestionRepository.create({
      protocol_code,
      name: protocol.name,
      questions: formatQuestions,
    })
    return this.classifyQuestionRepository.save(classifyQuestion)
  }

  async findAll(
    paginateClassifyQuestionDto: PaginateClassifyQuestionDto,
  ): Promise<{ formattedData: any; meta: any }> {
    const { keyword, ...paginateClassifyQuestion } = paginateClassifyQuestionDto
    const queryBuilder = this.classifyQuestionRepository
      .createQueryBuilder('classify_question')
      .select(['classify_question.id', 'classify_question.protocol_code', 'classify_question.name'])

    if (keyword) {
      const keywordLower = keyword.toLowerCase()
      queryBuilder.andWhere(
        `
            (LOWER(JSON_UNQUOTE(JSON_EXTRACT(classify_question.name, "$.vi"))) LIKE :keyword
             OR LOWER(JSON_UNQUOTE(JSON_EXTRACT(classify_question.name, "$.en"))) LIKE :keyword)
          `,
        { keyword: `%${keywordLower}%` },
      )
    }

    const { data, meta } = await paginate(queryBuilder, paginateClassifyQuestion)
    const formattedData = data.map(item => ({
      id: item.id,
      protocol_code: item.protocol_code,
      name: item.name,
    }))
    return {
      formattedData,
      meta,
    }
  }

  async findOneByProtocolCode(protocol_code: number): Promise<IClassifyQuestion> {
    const classifyQuestion = await this.classifyQuestionRepository
      .createQueryBuilder('classify_question')
      .select([
        'classify_question.id',
        'classify_question.protocol_code',
        'classify_question.name',
        'classify_question.questions',
      ])
      .where('classify_question.protocol_code = :protocol_code', { protocol_code })
      .getOne()
    if (!classifyQuestion) {
      throw new NotFoundException('Classify question not found')
    }

    const formatQuestions: IQuestion[] = classifyQuestion.questions.map((question, index) => ({
      id: question.id,
      question: question.question,
      multiple_choice: question.multiple_choice,
      answer: question.answer.map((answer, index) => ({
        id: answer.id,
        option: answer.option,
        value: answer.value,
        level: answer.level,
        change_protocol: answer.change_protocol,
        priority: answer.priority,
      })),
    }))

    const formattedClassifyQuestion: IClassifyQuestion = {
      protocol_code: classifyQuestion.protocol_code,
      name: classifyQuestion.name,
      questions: formatQuestions,
    }

    return formattedClassifyQuestion
  }

  async updateClassifyQuestion(
    protocol_code: number,
    updateClassifyQuestionDto: UpdateClassifyQuestionDto,
  ): Promise<void> {
    const { questions } = updateClassifyQuestionDto
    const classifyQuestion = await this.classifyQuestionRepository
      .createQueryBuilder('classify_question')
      .where('classify_question.protocol_code = :protocol_code', { protocol_code })
      .getOne()
    if (!classifyQuestion) {
      throw new NotFoundException('Classify question not found')
    }

    if (updateClassifyQuestionDto.protocol_code) {
      const protocol = await this.protocolRepository
        .createQueryBuilder('protocol')
        .select(['protocol.id', 'protocol.protocol_code', 'protocol.name'])
        .where('protocol.protocol_code = :protocol_code AND protocol.id != :id', {
          protocol_code: updateClassifyQuestionDto.protocol_code,
          id: classifyQuestion.protocol_code,
        })
        .getOne()
      if (protocol) {
        throw new BadRequestException('Protocol already exists')
      }
      classifyQuestion.protocol_code = protocol.protocol_code
    }

    if (updateClassifyQuestionDto.name) {
      classifyQuestion.name = updateClassifyQuestionDto.name
    }

    if (questions) {
      const formatQuestions: IQuestion[] = questions.map((question, index) => ({
        id: question.id,
        question: question.question,
        multiple_choice: question.multiple_choice,
        answer: question.answer.map((answer, index) => ({
          id: answer.id,
          option: answer.option,
          value: answer.value,
          level: answer.level,
          change_protocol: answer.change_protocol,
          priority: answer.priority,
        })),
      }))

      classifyQuestion.questions = formatQuestions
    }
    await this.classifyQuestionRepository.update(classifyQuestion.id, classifyQuestion)
  }

  async deleteClassifyQuestion(protocol_code: number): Promise<void> {
    const classifyQuestion = await this.classifyQuestionRepository
      .createQueryBuilder('classify_questions')
      .softDelete()
      .where('classify_questions.protocol_code = :protocol_code', { protocol_code })
      .execute()
    if (classifyQuestion.affected === 0) {
      throw new NotFoundException('Classify question not found')
    }
  }
}
