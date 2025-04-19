import { Controller, Get, Post, Query, Body, Put, Param, Delete } from '@nestjs/common'
import { ProtocolService } from './protocol.service'
import { PaginateProtocolDto } from './dtos/paginate-protocol.dto'
import { ResponseDto } from 'src/common/response.dto'
import { ApiOperation } from '@nestjs/swagger'
import { CreateProtocolDto } from './dtos/create-protocol.dto'
import { UpdateProtocolDto } from './dtos/update-protocol.dto'

@Controller('protocols')
export class ProtocolController {
  constructor(private readonly protocolService: ProtocolService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo giao thức' })
  async create(@Body() createProtocolDto: CreateProtocolDto): Promise<ResponseDto> {
    const data = await this.protocolService.create(createProtocolDto)
    return new ResponseDto({
      messageCode: 'CREATE_PROTOCOL_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Put(':protocol_code')
  @ApiOperation({ summary: 'Cập nhật giao thức' })
  async update(
    @Param('protocol_code') protocol_code: number,
    @Body() updateProtocolDto: UpdateProtocolDto,
  ): Promise<ResponseDto> {
    const data = await this.protocolService.update(protocol_code, updateProtocolDto)
    return new ResponseDto({
      messageCode: 'UPDATE_PROTOCOL_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Delete(':protocol_code')
  @ApiOperation({ summary: 'Xóa giao thức' })
  async delete(@Param('protocol_code') protocol_code: number): Promise<ResponseDto> {
    const data = await this.protocolService.delete(protocol_code)
    return new ResponseDto({
      messageCode: 'DELETE_PROTOCOL_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách giao thức' })
  async findAll(@Query() paginateProtocolDto: PaginateProtocolDto): Promise<ResponseDto> {
    const data = await this.protocolService.findAll(paginateProtocolDto)
    return new ResponseDto({
      messageCode: 'GET_PROTOCOL_SUCCESS',
      statusCode: 200,
      data: data.formattedData,
      meta: data.meta,
    })
  }
}
