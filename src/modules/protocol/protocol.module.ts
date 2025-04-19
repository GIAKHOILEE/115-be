import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProtocolController } from './protocol.controller'
import { Protocol } from './protocol.entity'
import { ProtocolService } from './protocol.service'
@Module({
  imports: [TypeOrmModule.forFeature([Protocol])],
  controllers: [ProtocolController],
  providers: [ProtocolService],
  exports: [ProtocolService],
})
export class ProtocolModule {}
