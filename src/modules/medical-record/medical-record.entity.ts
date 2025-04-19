import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IDoctorInfo, IRecord } from './medical-record.interface'

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'json', nullable: true })
  doctor: IDoctorInfo

  @Column({ type: 'json', nullable: true })
  records: IRecord[]

  @Column({ type: 'enum', enum: ['Green', 'Yellow', 'Red', 'Purple', 'Orange', 'Blue'], nullable: true })
  level_system: 'Green' | 'Yellow' | 'Red' | 'Purple' | 'Orange' | 'Blue'

  @Column({ type: 'enum', enum: ['Green', 'Yellow', 'Red', 'Purple', 'Orange', 'Blue'], nullable: true })
  level_doctor: 'Green' | 'Yellow' | 'Red' | 'Purple' | 'Orange' | 'Blue' | null

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date
}
