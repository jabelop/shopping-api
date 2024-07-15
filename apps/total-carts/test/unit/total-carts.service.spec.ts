import { Test, TestingModule } from '@nestjs/testing';
import { TotalCartsService } from '../../src/application/total-carts.service';
import Product from '../../../../libs/shared/src/application/product/prouctdto';

describe('OrdersService', () => {
  let service: TotalCartsService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [TotalCartsService],
    }).compile();

    service = module.get<TotalCartsService>(TotalCartsService);
  
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 230', async () => {
    const products: Product[] = [
        { id: "3aae2f88-818c-408b-9990-cd2d2f961623" , name: "product1", price: 10, stock: 10, reserved: 2 }, 
        { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product2", price: 130, stock: 4, reserved: 0 },
        { id: "4b90ef9d-33d1-487d-bc9e-f861558c84a0", name: "product3", price: 90, stock: 13, reserved: 3 }, 
    ];
    expect(service.getTotal(products)).toEqual(230);
  });

  it('should return 0', async () => {
    const products: Product[] = [];
    expect(service.getTotal(products)).toEqual(0);
  });

});
