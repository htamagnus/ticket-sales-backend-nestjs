import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CriarLugarRequest } from './request/criar-lugar.request';
import { AtualizarLugarRequest } from './request/atualizar-lugar.request';
import { SpotsService } from '@app/core/spots/spots.service';

@Controller('eventos/:eventoId/lugares')
export class LugaresController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Body() createSpotDto: CriarLugarRequest,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.create({
      name: createSpotDto.nome,
      eventId: eventId,
    });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('id') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.findOne(eventId, spotId);
  }

  @Patch(':spotId')
  update(
    @Param('id') spotId: string,
    @Param('eventId') eventId: string,
    @Body() atualizarLugarDto: AtualizarLugarRequest,
  ) {
    return this.spotsService.update(eventId, spotId, {
      name: atualizarLugarDto.nome,
    });
  }

  @Delete(':spotId')
  remove(@Param('id') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.remove(eventId, spotId);
  }
}
