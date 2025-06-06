import { Module } from '@nestjs/common'
import { MedicalRecordController } from './medical-record.controller'
import { MedicalRecordService } from './medical-record.service'
import { MedicalRecord } from './medical-record.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Protocol } from '../protocol/protocol.entity'
import { ClassifyQuestion } from '../classify-question/classify-question.entity'
import { Doctor } from '../doctor/doctor.entity'
@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Protocol, ClassifyQuestion, Doctor])],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordModule {}
