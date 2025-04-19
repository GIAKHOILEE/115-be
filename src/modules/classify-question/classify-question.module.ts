import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClassifyQuestion } from './classify-question.entity'
import { ClassifyQuestionService } from './classify-question.service'
import { ClassifyQuestionController } from './classify-question.controller'
import { Protocol } from 'src/modules/protocol/protocol.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ClassifyQuestion, Protocol])],
  controllers: [ClassifyQuestionController],
  providers: [ClassifyQuestionService],
})
export class ClassifyQuestionModule {}
