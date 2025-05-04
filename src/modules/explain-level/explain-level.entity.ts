import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('explain_level')
export class ExplainLevel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  level: number

  @Column({ type: 'text' })
  explain: string

  @Column({ type: 'text' })
  description: string

  @Column()
  ambulance_dispatch: string

  @Column()
  staff_dispatch: string

  @Column()
  medical_consultation: string

  @Column()
  emergency_report_mode: string
}
