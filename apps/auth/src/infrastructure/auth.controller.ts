import { BadRequestException, Controller, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { ClientProxy, Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import User from '../../../../libs/shared/src/application/user/userdto';

@Controller()
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService, @Inject('AUTH_SERVICE') private readonly rmqService: ClientProxy) { }
  
  @MessagePattern({ cmd: 'get-user' })
  async getUser(@Ctx() context: RmqContext): Promise<User> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      channel.ack(message);
      return {id: '1', username: "one", password: 'other'};//this.authService.validateUser(message.username, message.password);
    } catch (error) {
      throw new HttpException(`${error}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @MessagePattern({ cmd: 'login' })
  async login(@Ctx() context: RmqContext): Promise<string | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      const receivedUser: User = JSON.parse(message.content.toString()).data;
      const result: any = await this.authService.login(receivedUser);
      channel.ack(message);

      if (result) return result.access_token;
      return new BadRequestException("User or password incorrect");

    } catch (error) {
      return error;
    }
  }

  @MessagePattern({
    cmd: 'signup',
  })
  async signup(@Ctx() context: RmqContext): Promise<boolean | HttpException> {
    try {
      const channel: any = context.getChannelRef();
      const message: Record<string, string> = context.getMessage();
      console.info("message: ", message.content.toString());
      const receivedUser: User = JSON.parse(message.content.toString()).data;
      const result: boolean = await this.authService.save(receivedUser);
      channel.ack(message);
      
      if (result) return true;
    } catch (error) {
      return error;
    }
  }
}
