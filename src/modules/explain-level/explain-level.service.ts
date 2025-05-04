import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UpdateExplainLevelDto } from './dtos/update-explain-level.dto'
import { ExplainLevel } from './explain-level.entity'
import { IExplainLevel } from './explain-level.interface'
@Injectable()
export class ExplainLevelService {
  constructor(
    @InjectRepository(ExplainLevel)
    private explainLevelRepository: Repository<ExplainLevel>,
  ) {}

  async findAll(): Promise<IExplainLevel[]> {
    return this.explainLevelRepository.find()
  }

  async findOne(id: number): Promise<IExplainLevel> {
    return this.explainLevelRepository.findOne({ where: { id } })
  }

  async update(id: number, updateExplainLevelDto: UpdateExplainLevelDto): Promise<IExplainLevel> {
    await this.explainLevelRepository.update(id, updateExplainLevelDto)
    return this.findOne(id)
  }
}
