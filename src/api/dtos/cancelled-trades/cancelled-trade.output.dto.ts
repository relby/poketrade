import { ApiProperty, OmitType } from '@nestjs/swagger';
import { TradeOutputDTO } from '../trades/trade.output.dto';
import { AutoMap } from '@automapper/classes';
import { TradeStatus } from 'src/core/entities/trade.entity';

export class CancelledTradeOuputDTO extends OmitType(TradeOutputDTO, [
  'status',
]) {
  @ApiProperty({ enum: [TradeStatus.CANCELLED] })
  @AutoMap()
  status: TradeStatus.CANCELLED;
}
