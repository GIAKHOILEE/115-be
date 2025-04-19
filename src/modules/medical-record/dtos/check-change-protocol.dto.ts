import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsObject } from 'class-validator'
import { IResultQandA } from '../medical-record.interface'
export class CheckProtocolChangeDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Protocol code',
    example: 1,
  })
  protocol_code: number

  @IsNotEmpty()
  @IsObject({ each: true })
  @ApiProperty({
    description: 'Result Q and A',
    example: [
      {
        id: 1,
        answer: 'A',
      },
      {
        id: 2,
        answer: 'A',
      },
      {
        id: 3,
        answer: 'C',
      },
      {
        id: 4,
        answer: 'D',
      },
    ],
  })
  question_answer: IResultQandA[]
}
