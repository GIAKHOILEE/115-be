import { Controller, Post, Body, Get, Query, Param, Put, Delete } from '@nestjs/common'
import { ClassifyQuestionService } from './classify-question.service'
import { CreateClassifyQuestionDto } from './dtos/create-classify-question.dto'
import { ResponseDto } from 'src/common/response.dto'
import { PaginateClassifyQuestionDto } from './dtos/paginate-classify-question.dto'
import { UpdateClassifyQuestionDto } from './dtos/update-classify-question.dto'

@Controller('classify-question')
export class ClassifyQuestionController {
  constructor(private readonly classifyQuestionService: ClassifyQuestionService) {}

  @Post()
  async createClassifyQuestion(
    @Body() createClassifyQuestionDto: CreateClassifyQuestionDto,
  ): Promise<ResponseDto> {
    const classifyQuestion =
      await this.classifyQuestionService.createClassifyQuestion(createClassifyQuestionDto)
    return new ResponseDto({
      messageCode: 'CREATE_CLASSIFY_QUESTION_SUCCESS',
      statusCode: 200,
      data: classifyQuestion,
    })
  }

  @Get()
  async getClassifyQuestion(
    @Query() paginateClassifyQuestionDto: PaginateClassifyQuestionDto,
  ): Promise<ResponseDto> {
    const classifyQuestion = await this.classifyQuestionService.findAll(paginateClassifyQuestionDto)
    return new ResponseDto({
      messageCode: 'GET_CLASSIFY_QUESTION_SUCCESS',
      statusCode: 200,
      data: classifyQuestion.formattedData,
      meta: classifyQuestion.meta,
    })
  }

  @Get(':protocol_code')
  async getClassifyQuestionByProtocolCode(
    @Param('protocol_code') protocol_code: number,
  ): Promise<ResponseDto> {
    const classifyQuestion = await this.classifyQuestionService.findOneByProtocolCode(protocol_code)
    return new ResponseDto({
      messageCode: 'GET_CLASSIFY_QUESTION_BY_PROTOCOL_CODE_SUCCESS',
      statusCode: 200,
      data: classifyQuestion,
    })
  }

  @Put(':protocol_code')
  async updateClassifyQuestion(
    @Param('protocol_code') protocol_code: number,
    @Body() updateClassifyQuestionDto: UpdateClassifyQuestionDto,
  ): Promise<ResponseDto> {
    await this.classifyQuestionService.updateClassifyQuestion(protocol_code, updateClassifyQuestionDto)
    return new ResponseDto({
      messageCode: 'UPDATE_CLASSIFY_QUESTION_SUCCESS',
      statusCode: 200,
    })
  }

  @Delete(':protocol_code')
  async deleteClassifyQuestion(@Param('protocol_code') protocol_code: number): Promise<ResponseDto> {
    await this.classifyQuestionService.deleteClassifyQuestion(protocol_code)
    return new ResponseDto({
      messageCode: 'DELETE_CLASSIFY_QUESTION_SUCCESS',
      statusCode: 200,
    })
  }
}
