import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsArray, IsNumber, IsOptional, IsObject } from 'class-validator'
import { IQuestion } from '../classify-question.interface'
export class UpdateClassifyQuestionDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Mã giao thức', example: 1 })
  protocol_code: number

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({ description: 'Tên danh mục', example: { vi: 'Danh mục 1', en: 'Category 1' } })
  name: {
    vi: string
    en: string
  }

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({
    description: 'Câu hỏi',
    example: [
      {
        answer: [
          { level: 'Red', value: 'Trái', option: 'A', change_protocol: null },
          { level: 'Red', value: 'Phải', option: 'B', change_protocol: null },
          { level: 'Red', value: 'Toàn bộ ngực', option: 'C', change_protocol: null },
          { level: 'Red', value: 'Không rõ vị trí', option: 'D', change_protocol: null },
          { level: 'Red', value: 'Vú 1 hoặc 2 bên', option: 'E', change_protocol: null },
        ],
        question: 'Vị trí vùng bị đau?',
        multiple_choice: false,
      },
      {
        answer: [
          { level: 'Red', value: 'Có', option: 'A', change_protocol: null },
          { level: 'Red', value: 'Không', option: 'B', change_protocol: null },
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
          },
          {
            level: 'Red',
            value: 'Lơ mơ/ lú lẫn/ mở mắt mà không nói chuyện được',
            option: 'B',
            change_protocol: null,
          },
          {
            level: 'Purple',
            value: 'Hôn mê/ bất tỉnh/ lay gọi không đáp ứng',
            option: 'C',
            change_protocol: null,
          },
          { level: 'Red', value: 'Không xác định tình trạng', option: 'D', change_protocol: null },
        ],
        question: 'Bệnh nhân hiện còn tỉnh táo, tiếp xúc được hay không?',
        multiple_choice: false,
      },
      {
        answer: [
          { level: 'Yellow', value: 'Thở bình thường/ không khó thở', option: 'A', change_protocol: null },
          { level: 'Red', value: 'Thở nhanh/ có khó thở', option: 'B', change_protocol: null },
          { level: 'Purple', value: 'Thở chậm/ ngưng thở', option: 'C', change_protocol: null },
          { level: 'Red', value: 'Không xác định tình trạng', option: 'D', change_protocol: null },
        ],
        question: 'Nhịp thở bệnh nhân như thế nào?',
        multiple_choice: false,
      },
      {
        answer: [
          { level: 'Red', value: 'Nhiều/ dữ dội/ đau toát mồ hôi', option: 'A', change_protocol: null },
          { level: 'Yellow', value: 'Đau ít/ đau âm ỉ', option: 'B', change_protocol: null },
        ],
        question: 'Mức độ đau ngực?',
        multiple_choice: false,
      },
    ],
  })
  questions: IQuestion[]
}
