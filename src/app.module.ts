import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token/token.entity';
import { CommerceModule } from './commerce/commerce.module';
import { TokenModule } from './token/token.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.SQL_SERVER_HOST,
      port: 1433,
      username: process.env.SQL_SERVER_USER,
      password: process.env.SQL_SERVER_PWD,
      database: process.env.SQL_SERVER_DB,
      entities: [Token],
      synchronize: true, // Solo para desarrollo, no usar en producción
    }),
    CommerceModule,
    TokenModule,
    RedisModule.forRoot({
      config: { url: process.env.REDIS_URL }
    }), // Reemplaza 'URL_DE_CONEXION_REDIS' por tu URL de conexión a Redis
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
