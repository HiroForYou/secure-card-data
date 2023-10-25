import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { CommerceService } from './commerce.service';

@Controller('/commerce')
export class CommerceController {
    constructor(private readonly commerceService: CommerceService) { }

    @Post()
    createCommerce(@Body() data: any) {
        return this.commerceService.create(data);
    }

    @Get()
    getCommerce(@Headers('X-commerce-ID') commerceId: string) {
        return this.commerceService.findById(commerceId);
    }
}
