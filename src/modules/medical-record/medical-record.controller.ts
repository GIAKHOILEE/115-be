import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { ResponseDto } from 'src/common/response.dto'
import { CheckProtocolChangeDto } from './dtos/check-change-protocol.dto'
import { CreateMedicalRecordDto, CreateMedicalRecordDtoV2 } from './dtos/create-medical-record.dto'
import { MedicalRecordService } from './medical-record.service'
import { PaginateMedicalRecordDto } from './dtos/paginate-medical-record.dto'

@Controller('records')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  // @Post('check-change-protocol')
  // @ApiOperation({ summary: 'Kiểm tra chuyển giao thức' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'nếu có giao thức cần chuyển sẽ trả array {protocol_code, id}',
  //   example: [
  //     {
  //       protocol_code: 1,
  //       id: 4,
  //     },
  //     {
  //       protocol_code: 2,
  //       id: 5,
  //     },
  //     {
  //       protocol_code: 3,
  //       id: 6,
  //     },
  //   ],
  // })
  // async checkChangeProtocol(@Body() checkProtocolChangeDto: CheckProtocolChangeDto): Promise<ResponseDto> {
  //   const data = await this.medicalRecordService.checkProtocolChange(checkProtocolChangeDto)
  //   return new ResponseDto({
  //     messageCode: 'CHECK_PROTOCOL_CHANGE_SUCCESS',
  //     statusCode: 200,
  //     data,
  //   })
  // }

  // @Post('submit')
  // @ApiOperation({ summary: 'Submit medical record' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Submit medical record success và trả về level cao nhất',
  // })
  // async submitMedicalRecord(@Body() submitMedicalRecordDto: CreateMedicalRecordDto): Promise<ResponseDto> {
  //   const data = await this.medicalRecordService.submitMedicalRecord(submitMedicalRecordDto)
  //   return new ResponseDto({
  //     messageCode: 'SUBMIT_MEDICAL_RECORD_SUCCESS',
  //     statusCode: 200,
  //     data,
  //   })
  // }

  @Post('submit')
  @ApiQuery({
    name: 'id',
    required: false,
    type: Number,
  })
  @ApiOperation({ summary: 'Submit medical record' })
  @ApiResponse({
    status: 200,
    // description: 'Submit medical record success và trả về level cao nhất',
  })
  async submitMedicalRecordV2(
    @Body() submitMedicalRecordDto: CreateMedicalRecordDtoV2,
    @Query('id') id?: number,
  ): Promise<ResponseDto> {
    const data = await this.medicalRecordService.submitMedicalRecordV2(submitMedicalRecordDto, id)
    return new ResponseDto({
      messageCode: 'SUBMIT_MEDICAL_RECORD_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Get()
  @ApiOperation({ summary: 'Get list medical record' })
  @ApiResponse({
    status: 200,
    description: 'Get list medical record success',
  })
  async getListMedicalRecord(
    @Query() paginateMedicalRecordDto: PaginateMedicalRecordDto,
  ): Promise<ResponseDto> {
    const data = await this.medicalRecordService.getListMedicalRecord(paginateMedicalRecordDto)
    return new ResponseDto({
      messageCode: 'GET_LIST_MEDICAL_RECORD_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detail medical record' })
  @ApiResponse({
    status: 200,
    description: 'Get detail medical record success',
  })
  async getDetailMedicalRecord(@Param('id') id: number): Promise<ResponseDto> {
    const data = await this.medicalRecordService.getMedicalRecord(id)
    return new ResponseDto({
      messageCode: 'GET_DETAIL_MEDICAL_RECORD_SUCCESS',
      statusCode: 200,
      data,
    })
  }
}
