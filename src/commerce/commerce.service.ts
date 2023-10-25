import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import * as uuid from 'uuid';
import { Commerce } from './commerce.entity';

@Injectable()
export class CommerceService {
    private readonly redis: Redis;

    constructor(private readonly redisService: RedisService) {
        this.redis = this.redisService.getClient();
    }


    async create(data: any) {
        const commerce = new Commerce();
        commerce.name = data.name;
        commerce.area = data.area;
        commerce.n_workers = data.n_workers;

        // Guarda datos en Redis
        const id = uuid.v4()
        const key = `commerce:${id}`
        const response = await this.redis.set(key, JSON.stringify(commerce));
        return { id, response }
    }

    async findById(id: string) {
        // Intenta recuperar los datos de Redis
        const redisData = await this.redis.get('commerce:' + id);
        if (!redisData) {
            throw new NotFoundException(`Comercio con id ${id} no encontrado!`);
        }
        return { id, ...JSON.parse(redisData) };
    }
}
