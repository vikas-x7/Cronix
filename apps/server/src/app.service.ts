import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'OK',
      service: 'Cronix API',
      timestamp: new Date().toISOString(),
    };
  }
}
