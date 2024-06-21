import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  ArrayMinSize,
} from 'class-validator';
import { TicketKind } from '@prisma/client';

export class ReserveSpotRequest {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ArrayMinSize(1)
  spots: string[];

  @IsEnum(TicketKind)
  @IsNotEmpty()
  ticket_kind: TicketKind;

  @IsString()
  @IsNotEmpty()
  email: string;
}
