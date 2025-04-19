import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
@Entity('protocols')
export class Protocol {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'json', nullable: true })
  name: {
    vi: string
    en: string
  }

  @Column({ type: 'text', nullable: true })
  note: string

  @Column({ type: 'int', nullable: true })
  priority: number

  @Column({ type: 'int', nullable: true })
  protocol_code: number

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date
}
