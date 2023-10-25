import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';

// Mock de TokenService para simplificar la prueba
class MockTokenService {
  async getTokenByValue(tokenValue: string) {
    // Devuelve null para simular un token no encontrado
    return null;
  }
}

describe('TokenController', () => {
  let tokenController: TokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        {
          provide: TokenService,
          useClass: MockTokenService, // Utiliza el MockTokenService en lugar de TokenService real
        },
      ],
    }).compile();

    tokenController = module.get<TokenController>(TokenController);
  });

  it('should be defined', () => {
    expect(tokenController).toBeDefined();
  });

  describe('getTokenByValue', () => {
    it('should throw a NotFoundException for a non-existent token', async () => {
      const tokenValue = 'non-existent-token';

      try {
        await tokenController.getTokenByValue(tokenValue);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Token no encontrado');
      }
    });
  });
});
