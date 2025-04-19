import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsObject } from 'class-validator'

export class UpdateProtocolDto {
  @IsObject()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Tên giao thức',
    example: { vi: 'Tên giao thức tiếng Việt', en: 'Protocol Name' },
  })
  name: {
    vi: string
    en: string
  }

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Mô tả giao thức', example: 'Mô tả giao thức' })
  note: string

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Độ ưu tiên giao thức', example: 1 })
  priority: number

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Mã giao thức', example: 1 })
  protocol_code: number
}
