import { BadRequestException, Body, Controller, Get, HttpException, Inject, Param, Post, Response as ResponseAn } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import User from '../../../../libs/shared/src/application/user/userdto';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import * as bcrypt from 'bcrypt';
import Product from '../../../../libs/shared/src/application/product/prouctdto';
import Order from '../../../../libs/shared/src/application/order/orderdto';

@Controller()
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
    @Inject('PRODUCTS_SERVICE') private readonly productsService: ClientProxy,
    @Inject('ORDERS_SERVICE') private readonly ordersService: ClientProxy) { }

  @Post('auth/signup')
  async signup(
    @Body() user: User
  ) {
    if (!user.password || typeof user.password !== 'string' || user.password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters string');
    }
    user.password = await bcrypt.hash(user.password, 10);
    const result: Observable<boolean | { message: string, status: number }> = this.authService.send(
      {
        cmd: 'signup',
      },
      user
    );

    return result.pipe(map((value: boolean | { message: string, status: number }) => {
      if (typeof value === 'boolean') { return { success: true } }
      throw new BadRequestException(value.message);
    }));
  }

  @Post('auth/login')
  async login(
    @Body() user: User,
  ) {
    const result: Observable<string | { message: string, status: number }> = this.authService.send(
      {
        cmd: 'login',
      },
      user
    );
    return result.pipe(map((result: string | { message: string, status: number }) => {
      if (typeof result === 'string') return { access_token: result };
      throw new HttpException(result.message, result.status);
    }));
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string, @ResponseAn() res: Response) {
    const token = this.authService.send(
      {
        cmd: 'get-user',
      },
      { id }
    );
    res.header({ Authorization: token }).json(token);
  }

  @Post('products/save')
  async save(
    @Body() product: Product,
  ) {
    const result: Observable<string | { message: string, status: number }> = this.productsService.send(
      {
        cmd: 'save-product',
      },
      product
    );
    return result.pipe(map((result: string | { message: string, status: number }) => {
      if (typeof result === 'string') return { access_token: result };
      throw new HttpException(result.message, result.status);
    }));
  }

  @Post('orders/create')
  async create(
    @Body() order: Order,
  ) {
    const result: Observable<boolean | { message: string, status: number }> = this.ordersService.send(
      {
        cmd: 'create-order',
      },
      order
    );
    return result.pipe(map((result: boolean | { message: string, status: number }) => {
      if (typeof result === 'boolean') return { success: true };
      throw new HttpException(result.message, result.status);
    }));
  }

  @Get('orders/:id')
  async getOrder(@Param('id') id: string) {
    return this.ordersService.send(
      {
        cmd: 'get-order',
      },
      { id }
    ).pipe(map((result: Order | { message: string, status: number }) => {
      if ((<Order>result).id) return result;
      
      throw new HttpException(
        (<{ message: string, status: number }>result).message, 
        (<{ message: string, status: number }>result).status
      );
    }));
  }


}
