import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig } from './config/database.config'
import { AuthMiddleware } from './middleware/auth.middleware'
import { Protocol } from './modules/protocol/protocol.entity'
import { ProtocolModule } from './modules/protocol/protocol.module'
import { ClassifyQuestionModule } from './modules/classify-question/classify-question.module'
import { ClassifyQuestion } from './modules/classify-question/classify-question.entity'
import { MedicalRecordModule } from './modules/medical-record/medical-record.module'
import { MedicalRecord } from './modules/medical-record/medical-record.entity'
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Protocol, ClassifyQuestion, MedicalRecord]),
    // UsersModule,
    ProtocolModule,
    ClassifyQuestionModule,
    MedicalRecordModule,
  ],
  controllers: [],
  providers: [
    // SeederService
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*')
  }
}
