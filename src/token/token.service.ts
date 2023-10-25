import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class TokenService {
    private cardData: { [key: string]: string } = {};
    private secretKey = '12345678901234567890123456789012'; // Cambia esto a una clave secreta fuerte

    constructor(
        @InjectRepository(Token)
        private tokenRepository: Repository<Token>,
    ) { }

    async create(data: any) {
        const tokenValue = this.generateUniqueToken();
        const token = this.createTokenEntity(tokenValue);
        this.saveEncryptedCardData(tokenValue, data);

        return this.tokenRepository.save(token);
    }

    async getTokenByValue(tokenValue: string): Promise<{ token: Token, cardData: any | null }> {
        const token_find = await this.tokenRepository.findOne({ where: { value: tokenValue } });
        if (!token_find) {
            return null;
        }

        const cardData = this.getDecryptedCardData(tokenValue);

        return { token: token_find, cardData };
    }


    private generateUniqueToken() {
        let token: string;
        do {
            token = randomBytes(8).toString('hex');
        } while (this.cardData[token]);
        return token;
    }

    private encryptData(data: string) {
        const iv = randomBytes(16);
        const cipher = createCipheriv('aes-256-ctr', Buffer.from(this.secretKey), iv);
        let encryptedData = cipher.update(data);
        encryptedData = Buffer.concat([encryptedData, cipher.final()]);
        return `${iv.toString('hex')}:${encryptedData.toString('hex')}`;
    }

    private decryptData(encryptedData: string) {
        const [iv, data] = encryptedData.split(':');
        const decipher = createDecipheriv('aes-256-ctr', Buffer.from(this.secretKey), Buffer.from(iv, 'hex'));
        let decryptedData = decipher.update(Buffer.from(data, 'hex'));
        decryptedData = Buffer.concat([decryptedData, decipher.final()]);
        return decryptedData.toString();
    }

    private createTokenEntity(tokenValue: string): Token {
        const token = new Token();
        token.value = tokenValue;
        return token;
    }

    private saveEncryptedCardData(tokenValue: string, data: any) {
        const encryptedData = this.encryptData(JSON.stringify(data));
        this.cardData[tokenValue] = encryptedData;
    }

    private getDecryptedCardData(tokenValue: string): any | null {
        const encryptedData = this.cardData[tokenValue];

        if (!encryptedData) {
            return null;
        }

        const decryptedData = this.decryptData(encryptedData);

        try {
            return JSON.parse(decryptedData);
        } catch (error) {
            return null; // Manejar errores de análisis JSON si es necesario
        }
    }

    validateCardData(data: any) {
        this.validateCardLength(String(data.card_number));
        this.validateLuhnAlgorithm(String(data.card_number));
        this.validateCvvLength(String(data.cvv));
        this.validateEmailDomain(data.email);
        this.validateExpirationDate(data.expiration_month, data.expiration_year);
    }

    private validateCardLength(cardNumber: string) {
        if (cardNumber.length < 13 || cardNumber.length > 16) {
            throw new Error('Longitud del número de tarjeta inválida');
        }
    }

    private validateLuhnAlgorithm(cardNumber: string) {
        if (!this.isLuhnValid(cardNumber)) {
            throw new Error('Número de tarjeta inválido según el algoritmo de Luhn');
        }
    }

    private validateCvvLength(cvv: string) {
        if (cvv.length < 3 || cvv.length > 4) {
            throw new Error('Longitud del CVV inválida');
        }
    }

    private validateEmailDomain(email: string) {
        const validDomains = ['gmail.com', 'hotmail.com', 'yahoo.es'];
        const emailDomain = email.split('@')[1];
        if (!validDomains.includes(emailDomain)) {
            throw new Error('Dominio de correo electrónico no válido');
        }
    }

    private validateExpirationDate(month: string, year: string) {
        const expirationMonth = parseInt(month, 10);
        const expirationYear = parseInt(year, 10);
        const currentYear = new Date().getFullYear();

        if (
            expirationMonth < 1 ||
            expirationMonth > 12 ||
            expirationYear < currentYear ||
            expirationYear > currentYear + 5
        ) {
            throw new Error('Fecha de vencimiento no válida');
        }
    }

    private isLuhnValid(cardNumber: string) {
        let sum = 0;
        let isEven = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber.charAt(i), 10);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }
}
