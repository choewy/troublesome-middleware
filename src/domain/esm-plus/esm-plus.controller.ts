import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { EsmPlusOrderCollectDTO, EsmPlusOrderCollectCallbackDTO } from './dtos';
import { EsmPlusQueueService } from './esm-plus-queue.service';

@Controller('esm-plus')
export class EsmPlusController {
  constructor(private readonly esmPlusQueueService: EsmPlusQueueService) {}

  @Post('orders')
  @ApiOperation({ summary: 'ESM Plus 주문 수집 Queue 등록' })
  @ApiCreatedResponse({
    type: EsmPlusOrderCollectCallbackDTO,
    description: 'Callback URL로 결과 전송',
  })
  async registerCollectOrders(@Body() body: EsmPlusOrderCollectDTO) {
    return this.esmPlusQueueService.registOrderCollect(body);
  }
}