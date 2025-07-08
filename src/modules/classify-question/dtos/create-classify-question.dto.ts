import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator'
import { IQuestion } from '../classify-question.interface'
import { ApiProperty } from '@nestjs/swagger'
export class CreateClassifyQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'Mã giao thức', example: 1 })
  protocol_code: number

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    description: 'Câu hỏi',
    example: [
      {
        answer: [
          { level: 'Red', value: 'Trái', option: 'A', change_protocol: null, priority: 1 },
          { level: 'Red', value: 'Phải', option: 'B', change_protocol: null, priority: 2 },
          { level: 'Red', value: 'Toàn bộ ngực', option: 'C', change_protocol: null, priority: 3 },
          { level: 'Red', value: 'Không rõ vị trí', option: 'D', change_protocol: null, priority: 4 },
          { level: 'Red', value: 'Vú 1 hoặc 2 bên', option: 'E', change_protocol: null, priority: 5 },
        ],
        question: 'Vị trí vùng bị đau?',
        multiple_choice: false,
      },
      {
        answer: [
          { level: 'Red', value: 'Có', option: 'A', change_protocol: null, priority: 1 },
          { level: 'Red', value: 'Không', option: 'B', change_protocol: null, priority: 2 },
        ],
        question: 'Có chấn thương vùng ngực trước đó hay không?',
        multiple_choice: false,
      },
      {
        answer: [
          {
            level: 'Yellow',
            value: 'Tỉnh/ tiếp xúc tốt/ nói chuyện tốt',
            option: 'A',
            change_protocol: null,
            priority: 1,
          },
          {
            level: 'Red',
            value: 'Lơ mơ/ lú lẫn/ mở mắt mà không nói chuyện được',
            option: 'B',
            change_protocol: null,
            priority: 2,
          },
          {
            level: 'Purple',
            value: 'Hôn mê/ bất tỉnh/ lay gọi không đáp ứng',
            option: 'C',
            change_protocol: null,
            priority: 3,
          },
          {
            level: 'Red',
            value: 'Không xác định tình trạng',
            option: 'D',
            change_protocol: null,
            priority: 4,
          },
        ],
        question: 'Bệnh nhân hiện còn tỉnh táo, tiếp xúc được hay không?',
        multiple_choice: false,
      },
      {
        answer: [
          {
            level: 'Yellow',
            value: 'Thở bình thường/ không khó thở',
            option: 'A',
            change_protocol: null,
            priority: 1,
          },
          { level: 'Red', value: 'Thở nhanh/ có khó thở', option: 'B', change_protocol: null, priority: 2 },
          { level: 'Purple', value: 'Thở chậm/ ngưng thở', option: 'C', change_protocol: null, priority: 3 },
          {
            level: 'Red',
            value: 'Không xác định tình trạng',
            option: 'D',
            change_protocol: null,
            priority: 4,
          },
        ],
        question: 'Nhịp thở bệnh nhân như thế nào?',
        multiple_choice: false,
      },
      {
        answer: [
          {
            level: 'Red',
            value: 'Nhiều/ dữ dội/ đau toát mồ hôi',
            option: 'A',
            change_protocol: null,
            priority: 1,
          },
          { level: 'Yellow', value: 'Đau ít/ đau âm ỉ', option: 'B', change_protocol: null, priority: 2 },
        ],
        question: 'Mức độ đau ngực?',
        multiple_choice: false,
      },
    ],
  })
  questions: IQuestion[]
}
