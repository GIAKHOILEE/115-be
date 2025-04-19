import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ResponseDto } from 'src/common/response.dto'
import { CheckProtocolChangeDto } from './dtos/check-change-protocol.dto'
import { CreateMedicalRecordDto } from './dtos/create-medical-record.dto'
import { MedicalRecordService } from './medical-record.service'

@Controller('records')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Post('check-change-protocol')
  @ApiOperation({ summary: 'Kiểm tra chuyển giao thức' })
  @ApiResponse({
    status: 200,
    description: 'nếu có giao thức cần chuyển sẽ trả array {protocol_code, id}',
    example: [
      {
        protocol_code: 1,
        id: 4,
      },
      {
        protocol_code: 2,
        id: 5,
      },
      {
        protocol_code: 3,
        id: 6,
      },
    ],
  })
  async checkChangeProtocol(@Body() checkProtocolChangeDto: CheckProtocolChangeDto): Promise<ResponseDto> {
    const data = await this.medicalRecordService.checkProtocolChange(checkProtocolChangeDto)
    return new ResponseDto({
      messageCode: 'CHECK_PROTOCOL_CHANGE_SUCCESS',
      statusCode: 200,
      data,
    })
  }

  @Post('submit')
  @ApiOperation({ summary: 'Submit medical record' })
  @ApiResponse({
    status: 200,
    description: 'Submit medical record success và trả về level cao nhất',
  })
  async submitMedicalRecord(@Body() submitMedicalRecordDto: CreateMedicalRecordDto): Promise<ResponseDto> {
    const data = await this.medicalRecordService.submitMedicalRecord(submitMedicalRecordDto)
    return new ResponseDto({
      messageCode: 'SUBMIT_MEDICAL_RECORD_SUCCESS',
      statusCode: 200,
      data,
    })
  }
}
