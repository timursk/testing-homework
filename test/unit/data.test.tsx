import { describe, it } from '@jest/globals';
import { expect } from '@playwright/test';
import axios from 'axios';
import {
    CheckoutResponse,
    Product,
    ProductShortInfo,
} from '../../src/common/types';

describe('Корректные данные', () => {
    it('Возвращается корректный продукт', async () => {
        const response = await axios.get<Product>(
            `http://localhost:3000/hw/store/api/products/1?bug_id=${process.env.BUG_ID}`
        );
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('name');
        expect(response.data).toHaveProperty('price');
        expect(response.data).toHaveProperty('color');
        expect(response.data).toHaveProperty('material');
        expect(response.data).toHaveProperty('description');
        expect(response.data.id).toEqual(1);
    });
    it('Возвращается корректный айди заказа', async () => {
        const mockData = {
            form: { name: 'somename', phone: '89998887766', address: 'home' },
            cart: {
                0: {
                    name: 'keyboard',
                    count: 2,
                    price: 300,
                },
            },
        };

        const response = await axios.post<CheckoutResponse>(
            `http://localhost:3000/hw/store/api/checkout?bug_id=${process.env.BUG_ID}`,
            mockData
        );

        expect(response.data).toHaveProperty('id');

        const id = response.data.id;
        const orders = await axios.get<unknown[]>(
            'http://localhost:3000/hw/store/api/orders'
        );

        expect(id).toEqual(orders.data.length);
    });
    it('Приходит корректный список продуктов', async () => {
        const response = await axios.get<ProductShortInfo[]>(
            `http://localhost:3000/hw/store/api/products?bug_id=${process.env.BUG_ID}`
        );
        expect(response.data[0]).toHaveProperty('id');
        expect(response.data[0]).toHaveProperty('name');
        expect(response.data[0]).toHaveProperty('price');
    });
});
