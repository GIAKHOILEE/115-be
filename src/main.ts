import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as dotenv from 'dotenv'
import * as cookieParser from 'cookie-parser'
import { HttpException, HttpStatus, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())
  app.enableCors({
    origin: '*',
  })

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Danh sách API của hệ thống')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: errors => {
        const messages = errors.map(error => Object.values(error.constraints)).flat()
        const message = messages[0] || 'Validation failed'
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        )
      },
    }),
  )

  app.use((req, res, next) => {
    const startTime = Date.now()
    res.on('finish', () => {
      const duration = Date.now() - startTime
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
      )
    })
    next()
  })

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)

  const host = process.env.HOST || 'localhost'
  const port = process.env.PORT || 3001
  await app.listen(port)

  console.info(`🚀 Server running on: ${host}:${port}`)
}
bootstrap()
