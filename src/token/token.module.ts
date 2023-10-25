// token.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './token.entity';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Token])],
    providers: [TokenService],
    controllers: [TokenController], // Agrega tus controladores aquí si los tienes
    exports: [TokenService],
})
export class TokenModule { }
