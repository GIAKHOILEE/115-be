import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { IQuestion } from './classify-question.interface'

@Entity('classify_questions')
export class ClassifyQuestion {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'int' })
  protocol_code: number

  @Column({ type: 'json', nullable: true })
  name: {
    vi: string
    en: string
  }

  @Column({ type: 'json', nullable: true })
  questions: IQuestion[]

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date
}
