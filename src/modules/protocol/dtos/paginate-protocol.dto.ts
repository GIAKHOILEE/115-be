import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { PaginationParams } from 'src/common/pagination'

export class PaginateProtocolDto extends PaginationParams {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: ' filter ID giao thức' })
  id: string

  // @IsString()
  // @IsOptional()
  // @ApiPropertyOptional({ description: 'Tên giao thức' })
  // name: string

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ description: ' filter Mã giao thức' })
  protocol_code: string
}
