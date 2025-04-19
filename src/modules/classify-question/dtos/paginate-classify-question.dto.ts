import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional } from 'class-validator'
import { PaginationParams } from 'src/common/pagination'

export class PaginateClassifyQuestionDto extends PaginationParams {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: ' filter ID giao thức' })
  protocol_code: number
}
