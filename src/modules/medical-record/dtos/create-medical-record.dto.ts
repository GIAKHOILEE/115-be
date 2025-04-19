import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator'
import { IDoctorInfo, IRecord } from '../medical-record.interface'
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
