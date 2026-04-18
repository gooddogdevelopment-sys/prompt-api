import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  SetMetadata,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { verifyWebhook } from '@clerk/backend/webhooks';
import { IS_PUBLIC_KEY } from '../auth/clerk-auth.guard';
import { UsersService } from '../users/users.service';

const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@ApiExcludeController()
@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('clerk')
  @HttpCode(HttpStatus.OK)
  async handleClerk(@Req() req: RawBodyRequest<Request>): Promise<string> {
    try {
      if (!req.rawBody) {
        throw new Error(
          'Missing rawBody — is { rawBody: true } set in NestFactory.create?',
        );
      }

      const fetchReq = new Request(`http://webhook${req.originalUrl}`, {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: req.rawBody.toString('utf8'),
      });

      const evt = await verifyWebhook(fetchReq);

      const { id } = evt.data;
      const eventType = evt.type;
      this.logger.log(
        `Received webhook with ID ${id} and event type of ${eventType}`,
      );

      if (id === undefined) {
        throw new BadRequestException('Id is not defined in webhook');
      }

      if (eventType === 'user.created') {
        await this.usersService.createFromClerk(id);
      }

      return 'Webhook received';
    } catch (err) {
      this.logger.error('Error verifying webhook:', err);
      throw new BadRequestException('Error verifying webhook');
    }
  }
}
