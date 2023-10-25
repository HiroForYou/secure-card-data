import { Test, TestingModule } from '@nestjs/testing';
import { CommerceService } from './commerce.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Commerce } from './commerce.entity';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { NotFoundException } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

describe('CommerceService', () => {
    let service: CommerceService;
    let repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommerceService,
                {
                    provide: getRepositoryToken(Commerce),
                    useValue: {
                        save: jest.fn((commerce) => commerce),
                        findOneById: jest.fn((id) => ({ id })),
                    },
                },
            ],
            imports: [RedisModule.forRoot({ config: { url: process.env.REDIS_URL } })],
        }).compile();

        service = module.get<CommerceService>(CommerceService);
        repository = module.get(getRepositoryToken(Commerce));
    });

    describe('create', () => {
        it('should create a commerce <Service>', async () => {
            const data = { name: 'Test Commerce', area: 'dev', n_workers: 50 };
            jest.spyOn(repository, 'save').mockResolvedValue(data);

            const result = await service.create(data);

            expect(result.response).toEqual("OK");
        });
    });

    describe('findById', () => {
        it('should throw a NotFoundException when the commerce is not found', async () => {
            const id = "1234";
            jest.spyOn(repository, 'findOneById').mockResolvedValue(null); // Simula que el resultado no se encuentra en la base de datos.

            try {
                await service.findById(id);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });
});