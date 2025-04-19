import { MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig } from './config/database.config'
import { AuthMiddleware } from './middleware/auth.middleware'
import { Protocol } from './modules/protocol/protocol.entity'
import { ProtocolModule } from './modules/protocol/protocol.module'
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([Protocol]),
    // UsersModule,
    ProtocolModule,
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
