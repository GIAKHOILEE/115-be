import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ResponseDto } from 'src/common/response.dto'
import { UpdateExplainLevelDto } from './dtos/update-explain-level.dto'
import { ExplainLevelService } from './explain-level.service'

@Controller('explain-level')
export class ExplainLevelController {
  constructor(private readonly explainLevelService: ExplainLevelService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách cấp độ giải thích' })
  async findAll(): Promise<ResponseDto> {
    const data = await this.explainLevelService.findAll()
    return new ResponseDto({
      messageCode: 'GET_EXPLAIN_LEVEL_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy cấp độ giải thích theo id' })
  async findOne(@Param('id') id: number): Promise<ResponseDto> {
    const data = await this.explainLevelService.findOne(id)
    return new ResponseDto({
      messageCode: 'GET_EXPLAIN_LEVEL_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật cấp độ giải thích theo id' })
  async update(
    @Param('id') id: number,
    @Body() updateExplainLevelDto: UpdateExplainLevelDto,
  ): Promise<ResponseDto> {
    const data = await this.explainLevelService.update(id, updateExplainLevelDto)
    return new ResponseDto({
      messageCode: 'UPDATE_EXPLAIN_LEVEL_SUCCESS',
      statusCode: 200,
      data,
    })
  }
}
