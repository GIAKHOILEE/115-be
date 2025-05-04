import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExplainLevel } from './explain-level.entity'
import { ExplainLevelController } from './explain-level.controller'
import { ExplainLevelService } from './explain-level.service'

@Module({
  imports: [TypeOrmModule.forFeature([ExplainLevel])],
  controllers: [ExplainLevelController],
  providers: [ExplainLevelService],
})
export class ExplainLevelModule {}
