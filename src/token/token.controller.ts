import { Controller, Post, Body, Get, Param, NotFoundException, Catch, HttpException } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('/token')
@Catch(HttpException) // Captura excepciones generadas por HttpException
export class TokenController {
    constructor(private readonly tokenService: TokenService) { }

    @Post()
    createToken(@Body() data: any) {
        try {
            this.tokenService.validateCardData(data); // Llama a la validación
            const result = this.tokenService.create(data);
            return result;
        } catch (error) {
            throw new HttpException(error.message, 400); // Devuelve un error HTTP 400 con el mensaje de error
        }
    }

    @Get(':tokenValue')
    async getTokenByValue(@Param('tokenValue') tokenValue: string) {
        const result = await this.tokenService.getTokenByValue(tokenValue);
        if (!result) {
            throw new NotFoundException('Token no encontrado');
        }
        return result;
    }
}
