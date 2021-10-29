import { Controller, Get, Param } from '@nestjs/common';

@Controller('unauthorized')
export class UnauthorizedController {
  constructor() {}

  @Get()
  async index(): Promise<boolean> {
    return true;
  }
}
