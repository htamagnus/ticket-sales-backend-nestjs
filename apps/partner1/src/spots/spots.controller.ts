import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SpotsService } from '@app/core/spots/spots.service';
import { CreateSpotRequest } from './request/create-spot.request';
import { UpdateSpotRequest } from './request/update-spot.request';
import { ReserveSpotRequest } from '../events/request/reserve-spot.request';
import { AuthGuard } from '@app/core/auth/auth.guard';

@Controller('events/:eventId/spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Post()
  create(
    @Body() createSpotDto: CreateSpotRequest,
    @Param('eventId') eventId: string,
  ) {
    return this.spotsService.create({
      ...createSpotDto,
      eventId,
    });
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.spotsService.findAll(eventId);
  }

  @Get(':spotId')
  findOne(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.findOne(eventId, spotId);
  }

  @Patch(':spotId')
  update(
    @Param('spotId') spotId: string,
    @Param('eventId') eventId: string,
    @Body() updateSpotDto: UpdateSpotRequest,
  ) {
    return this.spotsService.update(eventId, spotId, updateSpotDto);
  }

  @Delete(':spotId')
  remove(@Param('spotId') spotId: string, @Param('eventId') eventId: string) {
    return this.spotsService.remove(eventId, spotId);
  }

  @UseGuards(AuthGuard)
  @Post(':spotId/reserve')
  async reserveSpots(
    @Body() dto: ReserveSpotRequest,
    @Param('eventId') eventId: string,
  ) {
    try {
      await this.spotsService.reserveSpots(eventId, dto.spots);
      return { message: 'Spots reserved successfully' };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      } else {
        throw new BadRequestException(error.message);
      }
    }
  }
}
