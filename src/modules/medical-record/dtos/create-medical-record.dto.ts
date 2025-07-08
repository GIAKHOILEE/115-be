import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator'
import { IDoctorInfo, Ipatient, IRecord } from '../medical-record.interface'
import { RecordLevel } from 'src/constants/record-level.enum'
import { IQuestion } from 'src/modules/classify-question/classify-question.interface'
export class CreateMedicalRecordDto {
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
  doctor: IDoctorInfo

  @IsNotEmpty()
  @IsObject({ each: true })
  @ApiProperty({
    description: 'Records',
    example: [
      {
        protocol_code: 1,
        note: 'Note 1',
        question_answer: [
          {
            id: 1,
            answer: 'A',
          },
          {
            id: 2,
            answer: 'B',
          },
          {
            id: 3,
            answer: 'C',
          },
        ],
      },
      {
        protocol_code: 2,
        note: 'Note 2',
        question_answer: [
          {
            id: 1,
            answer: 'A',
          },
          {
            id: 2,
            answer: 'B',
          },
        ],
      },
    ],
  })
  records: IRecord[]
}

export class CreateMedicalRecordDtoV2 {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
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
  @IsNumber()
  @ApiPropertyOptional({
    description: '1 | 2 | 3 | 4 | 5 | 6',
    example: 1,
  })
  level_doctor: number | null // doctor đánh giá

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

export class CreateMedicalRecordDtoV3 {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
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
  @IsNumber()
  @ApiPropertyOptional({
    description: '1 | 2 | 3 | 4 | 5 | 6',
    example: 1,
  })
  level_doctor: number | null // doctor đánh giá

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

export class SubmitPatientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Mã bệnh án',
    example: 'MD_123456789',
  })
  code: string

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Patient information',
    example: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      birth: '1990-01-01',
      gender: 'male',
    },
  })
  patient: Ipatient
}

export class SubmitDoctorDto {
  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    description: 'Doctor information',
    example: {
      name: 'Vu',
      email: 'hoangvu.nhv.xyz@gmail.com',
      birth: '1990-01-01',
      gender: 'male',
      role: 'doctor',
    },
  })
  doctor: IDoctorInfo
}
