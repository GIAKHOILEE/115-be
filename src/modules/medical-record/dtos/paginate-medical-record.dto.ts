import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { PaginationParams } from 'src/common/pagination'

export class PaginateMedicalRecordDto extends PaginationParams {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Mã bệnh án' })
  code: string
}
