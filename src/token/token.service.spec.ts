import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Token } from './token.entity';

describe('TokenService', () => {
  let service: TokenService;
  let repository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getRepositoryToken(Token),
          useValue: {
            save: jest.fn((token) => token),
            findOne: jest.fn((value) => ({ value })),
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    repository = module.get(getRepositoryToken(Token));
  });

  describe('create', () => {
    it('should create a token', async () => {
      const data = {
        card_number: '4111111111111111',
        cvv: '123',
        email: 'test@gmail.com',
        expiration_month: '12',
        expiration_year: '2025',
      };
      jest.spyOn(repository, 'save').mockResolvedValue(data);

      const result = await service.create(data);

      expect(result).toEqual(data);
    });
  });

  describe('getTokenByValue', () => {
    it('should get a token by value', async () => {
      const value = '12345678';
      jest.spyOn(repository, 'findOne').mockResolvedValue({ value });

      const result = await service.getTokenByValue(value);
      expect(result).toEqual({ token: { value }, cardData: null });
    });
  });

  describe('validateCardData', () => {
    it('should throw an error if the card data is invalid', () => {
      const data = {
        card_number: '1234',
        cvv: '12',
        email: 'test@example.com',
        expiration_month: '13',
        expiration_year: '2020',
      };

      expect(() => service.validateCardData(data)).toThrow();
    });

    it('should not throw an error if the card data is valid', () => {
      const data = {
        card_number: '4111111111111111',
        cvv: '123',
        email: 'test@gmail.com',
        expiration_month: '12',
        expiration_year: '2025',
      };

      expect(() => service.validateCardData(data)).not.toThrow();
    });
  });
});