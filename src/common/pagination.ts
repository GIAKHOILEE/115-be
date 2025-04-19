import { SelectQueryBuilder } from 'typeorm'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { removeVietnameseTones } from './utils'
import { IsOptional } from 'class-validator'

export class PaginationParams {
  @ApiPropertyOptional({ description: 'Trang hiện tại', example: 1 })
  @IsOptional()
  page?: number

  @ApiPropertyOptional({ description: 'Số lượng mỗi trang', example: 10 })
  @IsOptional()
  limit?: number

  filters?: Record<string, any>

  @ApiPropertyOptional({ description: 'Sắp xếp theo trường nào', example: 'id' })
  @IsOptional()
  orderBy?: string

  @ApiPropertyOptional({ description: 'Chiều sắp xếp', enum: ['ASC', 'DESC'], example: 'DESC' })
  @IsOptional()
  orderDirection?: 'ASC' | 'DESC'
}

export async function paginate<T>(queryBuilder: SelectQueryBuilder<T>, params: PaginationParams) {
  const { page = 1, limit = 10, orderBy, orderDirection = 'DESC', ...filters } = params

  const mainTableAlias = queryBuilder.alias
  console.log(mainTableAlias)

  Object.keys(filters).forEach(key => {
    let value = filters[key]?.toString().trim()
    if (value) {
      value = removeVietnameseTones(value.toLowerCase())

      queryBuilder.andWhere(`LOWER(${mainTableAlias}.${key}) LIKE :${key}`, {
        [key]: `%${value}%`,
      })
    }
  })

  if (orderBy) {
    queryBuilder.orderBy(`${mainTableAlias}.${orderBy}`, orderDirection)
  }

  const [data, total] = await queryBuilder
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount()

  const meta = {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
  }
  return {
    data,
    meta,
  }
}
