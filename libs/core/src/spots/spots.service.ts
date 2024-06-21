import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSpotDto } from './dto/create-spot.dto';
import { UpdateSpotDto } from './dto/update-spot.dto';
import { SpotStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SpotsService {
  constructor(private prismaService: PrismaService) {}

  async create(createSpotDto: CreateSpotDto & { eventId: string }) {
    const event = await this.prismaService.event.findFirst({
      where: {
        id: createSpotDto.eventId,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prismaService.spot.create({
      data: {
        ...createSpotDto,
        status: SpotStatus.available,
      },
    });
  }

  async reserveSpots(eventId: string, spots: string[]) {
    const foundSpots = await this.prismaService.spot.findMany({
      where: {
        eventId,
        id: { in: spots },
      },
    });

    const foundSpotIds = foundSpots.map((spot) => spot.id);
    const missingSpots = spots.filter((spot) => !foundSpotIds.includes(spot));

    if (missingSpots.length) {
      throw new NotFoundException(
        `Spots not exists: ${missingSpots.join(', ')}`,
      );
    }

    const unavailableSpots = foundSpots.filter(
      (spot) => spot.status !== SpotStatus.available,
    );

    if (unavailableSpots.length) {
      throw new BadRequestException(
        `Spots ${unavailableSpots.map((spot) => spot.id).join(', ')} are not available for reservation`,
      );
    }

    try {
      await this.prismaService.$transaction(async (prisma) => {
        await prisma.spot.updateMany({
          where: {
            id: { in: spots },
          },
          data: {
            status: SpotStatus.reserved,
          },
        });
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll(eventId: string) {
    return this.prismaService.spot.findMany({
      where: {
        eventId,
      },
    });
  }

  findOne(eventId: string, spotId: string) {
    return this.prismaService.spot.findFirst({
      where: {
        id: spotId,
        eventId,
      },
    });
  }

  update(eventId: string, spotId: string, updateSpotDto: UpdateSpotDto) {
    return this.prismaService.spot.update({
      data: updateSpotDto,
      where: {
        id: spotId,
        eventId,
      },
    });
  }

  remove(eventId: string, spotId: string) {
    return this.prismaService.spot.delete({
      where: {
        id: spotId,
        eventId,
      },
    });
  }
}
