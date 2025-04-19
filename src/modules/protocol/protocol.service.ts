import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate } from 'src/common/pagination'
import { Repository } from 'typeorm/repository/Repository'
import { CreateProtocolDto } from './dtos/create-protocol.dto'
import { PaginateProtocolDto } from './dtos/paginate-protocol.dto'
import { Protocol } from './protocol.entity'
import { UpdateProtocolDto } from './dtos/update-protocol.dto'
import { IProtocol } from './protocol.interface'
@Injectable()
export class ProtocolService {
  constructor(
    @InjectRepository(Protocol)
    private readonly protocolRepository: Repository<Protocol>,
  ) {}

  async create(createProtocolDto: CreateProtocolDto): Promise<Protocol> {
    const exitProtocol = await this.protocolRepository
      .createQueryBuilder('protocols')
      .where('protocols.protocol_code = :protocol_code', { protocol_code: createProtocolDto.protocol_code })
      .getOne()
    if (exitProtocol) {
      throw new BadRequestException('Protocol code already exists')
    }
    const protocol = this.protocolRepository.create(createProtocolDto)
    return this.protocolRepository.save(protocol)
  }

  async findAll(paginateProtocolDto: PaginateProtocolDto): Promise<{ formattedData: any; meta: any }> {
    const queryBuilder = this.protocolRepository
      .createQueryBuilder('protocol')
      .select([
        'protocol.id',
        'protocol.name',
        'protocol.protocol_code',
        'protocol.priority',
        'protocol.note',
      ])

    const { data, meta } = await paginate(queryBuilder, paginateProtocolDto)

    const formattedData = data.map(item => ({
      id: item.id,
      name: item.name,
      protocol_code: item.protocol_code,
      priority: item.priority,
      note: item.note,
    }))
    return {
      formattedData,
      meta,
    }
  }

  async findOne(protocol_code: number): Promise<IProtocol> {
    const protocol = await this.protocolRepository
      .createQueryBuilder('protocols')
      .where('protocols.protocol_code = :protocol_code', { protocol_code })
      .getOne()

    if (!protocol) {
      throw new NotFoundException('Protocol not found')
    }

    const formattedProtocol = {
      id: protocol.id,
      name: protocol.name,
      protocol_code: protocol.protocol_code,
      priority: protocol.priority,
      note: protocol.note,
    }
    return formattedProtocol
  }

  async update(protocol_code: number, updateProtocolDto: UpdateProtocolDto): Promise<void> {
    const { name, note, priority } = updateProtocolDto
    const protocol = await this.protocolRepository
      .createQueryBuilder('protocols')
      .where('protocols.protocol_code = :protocol_code', { protocol_code })
      .getOne()

    if (!protocol) {
      throw new NotFoundException('Protocol not found')
    }

    if (updateProtocolDto.protocol_code) {
      const exitProtocol = await this.protocolRepository
        .createQueryBuilder('protocols')
        .where('protocols.protocol_code = :protocol_code AND protocols.id != :id', {
          protocol_code: updateProtocolDto.protocol_code,
          id: protocol.id,
        })
        .getOne()
      if (exitProtocol) {
        throw new BadRequestException('Protocol is already exists')
      }
    }

    const newProtocol = {
      name: name || protocol.name,
      note: note || protocol.note,
      priority: priority || protocol.priority,
      protocol_code: updateProtocolDto.protocol_code || protocol.protocol_code,
    }

    await this.protocolRepository.update(protocol.id, newProtocol)
    return
  }

  async delete(protocol_code: number) {
    const protocol = await this.protocolRepository
      .createQueryBuilder('protocols')
      .softDelete()
      .where('protocols.protocol_code = :protocol_code', { protocol_code })
      .execute()
    if (protocol.affected === 0) {
      throw new NotFoundException('Protocol not found')
    }
  }
}
