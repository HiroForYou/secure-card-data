import { Test, TestingModule } from '@nestjs/testing';
import { CommerceController } from './commerce.controller';
import { CommerceService } from './commerce.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import * as dotenv from 'dotenv';
dotenv.config();

describe('CommerceController', () => {
  let controller: CommerceController;
  let service: CommerceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommerceController],
      providers: [CommerceService],
      imports: [RedisModule.forRoot({ config: { url: process.env.REDIS_URL } })],
    }).compile();

    controller = module.get<CommerceController>(CommerceController);
    service = module.get<CommerceService>(CommerceService);
  });

  describe('createCommerce', () => {
    it('should create a commerce', async () => {
      const mockCommerce: { id: any, response: "OK" } = { id: '123', response: 'OK' };
      jest.spyOn(service, 'create').mockResolvedValue(mockCommerce);


      const result = await controller.createCommerce(mockCommerce);

      expect(result).toEqual(mockCommerce);
    });
  });

  describe('getCommerce', () => {
    it('should get a commerce by ID', async () => {
      const mockCommerceId = 'b698e944-f2e1-4b95-aed9-67faeba3ac14';
      const mockCommerce = { id: mockCommerceId };

      jest.spyOn(service, 'findById').mockResolvedValue(mockCommerce);

      const result = await controller.getCommerce(mockCommerceId);

      expect(result).toEqual(mockCommerce);
    });
  });
});
