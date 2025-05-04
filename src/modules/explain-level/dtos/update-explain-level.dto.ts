import { IsNumber, IsString } from 'class-validator'

export class UpdateExplainLevelDto {
  @IsString()
  name: string

  @IsNumber()
  level: number

  @IsString()
  explain: string

  @IsString()
  description: string

  @IsString()
  ambulance_dispatch: string

  @IsString()
  staff_dispatch: string

  @IsString()
  medical_consultation: string

  @IsString()
  emergency_report_mode: string
}
