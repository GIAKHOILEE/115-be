import { IsObject, IsOptional, IsNotEmpty, IsNumber, IsString, IsEnum, IsBoolean } from 'class-validator'
import { IDoctorInfo, Ipatient } from '../medical-record.interface'
import { RecordLevel } from 'src/constants/record-level.enum'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IQuestion } from 'src/modules/classify-question/classify-question.interface'

export class UpdateMedicalRecordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Mã bệnh án',
    example: 'MD_123456789',
  })
  code: string

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Protocol code',
    example: 1,
  })
  protocol_code: number

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Note',
    example: 'Note 1',
  })
  note: string | null

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Protocol code trước đó nếu có, không có thì null',
    example: 1,
  })
  protocol_before: number | null

  @IsOptional()
  @IsEnum(RecordLevel)
  @ApiPropertyOptional({
    description: 'Green | Yellow | Orange | Red | Purple | Blue',
    example: 'Green',
  })
  level_doctor: RecordLevel | null // doctor đánh giá

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    description: 'Doctor information',
    example: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      birth_date: '1990-01-01',
      gender: 'male',
      role: 'doctor',
    },
  })
  doctor: IDoctorInfo | null

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    description: 'Patient information',
    example: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      birth_date: '1990-01-01',
      gender: 'male',
    },
  })
  patient: Ipatient | null

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Có cần tư vấn y tế không',
    example: false,
  })
  medical_advice: boolean | null

  @IsNotEmpty()
  @IsObject({ each: true })
  @ApiProperty({
    description: 'Result Q and A',
    example: [
      {
        id: 1,
        question: 'Vị trí vùng bị đau?',
        answer: [
          {
            id: 1,
            level: 'Red',
            value: 'Trái',
            option: 'A',
            change_protocol: 3,
          },
        ],
      },
      {
        id: 2,
        question: 'Có chấn thương vùng ngực trước đó hay không?',
        answer: [
          {
            id: 3,
            level: 'Red',
            value: 'Có',
            option: 'C',
            change_protocol: null,
          },
        ],
      },
    ],
  })
  resultQandA: IQuestion[]
}
