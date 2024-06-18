import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../libs/core/src/prisma/prisma.module';
import { EventsCoreModule, SpotsCoreModule } from '@app/core';

@Module({
  imports: [EventsCoreModule, PrismaModule, SpotsCoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
