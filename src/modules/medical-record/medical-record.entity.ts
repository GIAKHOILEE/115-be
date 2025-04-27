import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IDoctorInfo, Ipatient, IRecord } from './medical-record.interface'
import { RecordLevel } from 'src/constants/record-level.enum'

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'varchar', unique: true })
  code: string

  @Column({ type: 'json', nullable: true, default: null })
  doctor: IDoctorInfo

  @Column({ type: 'json', nullable: true, default: null })
  patient: Ipatient

  @Column({ type: 'boolean', nullable: true, default: false })
  medical_advice: boolean

  @Column({ type: 'text', nullable: true, default: null })
  note: string | null

  @Column({ type: 'int', nullable: true, default: null })
  protocol_before: number | null

  @Column({ type: 'json' })
  records: IRecord[]

  @Column({ type: 'enum', enum: RecordLevel })
  level_system: RecordLevel

  @Column({ type: 'enum', enum: RecordLevel, nullable: true, default: null })
  level_doctor: RecordLevel | null

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date
}
