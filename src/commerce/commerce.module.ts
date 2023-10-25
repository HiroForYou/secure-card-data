// commerce.module.ts
import { Module } from '@nestjs/common'; // Importa ModuleRef
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commerce } from './commerce.entity';
import { CommerceService } from './commerce.service';
import { CommerceController } from './commerce.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Commerce]),
    ],
    providers: [CommerceService],
    controllers: [CommerceController], // Agrega tus controladores aquí si los tienes
    exports: [CommerceService],
})
export class CommerceModule { }
