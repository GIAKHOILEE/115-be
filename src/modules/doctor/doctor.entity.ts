import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  email: string

  @Column({ nullable: true })
  birth: string

  @Column({ nullable: true })
  gender: string

  @Column({ nullable: true })
  role: string

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date

  @DeleteDateColumn({ type: 'timestamp' })
  deleted_at: Date
}
