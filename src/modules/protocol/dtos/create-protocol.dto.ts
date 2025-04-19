import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString, IsObject } from 'class-validator'

export class CreateProtocolDto {
  @IsObject()
  @IsNotEmpty()
  @ApiProperty({ description: 'Tên giao thức', example: { vi: 'Tên giao thức', en: 'Protocol name' } })
  name: {
    vi: string
    en: string
  }

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Mô tả giao thức', example: 'Mô tả giao thức' })
  note: string

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Độ ưu tiên giao thức', example: 1 })
  priority: number

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Mã giao thức', example: 1 })
  protocol_code: number
}
