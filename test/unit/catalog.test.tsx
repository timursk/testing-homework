import React from 'react';
import { Application } from '../../src/client/Application';
import { findByText, render, within } from '../utils/test-utils';
import { describe, it, expect, jest } from '@jest/globals';
import userEvent from '@testing-library/user-event';

describe('Каталог работает корректно', () => {
    it('В каталоге должны отображаться товары, список которых приходит с сервера', async () => {
        const app = <Application />;
        const products = [
            { id: 1, name: 'Cheese', price: 666 },
            { id: 2, name: 'Keyboard', price: 567 },
            { id: 5, name: 'Car', price: 34 },
        ];
        const { findAllByTestId } = render(app, {
            customPath: '/catalog',
            customData: products,
        });

        for (let { id } of products) {
            const card = await findAllByTestId(id);
            expect(card.length).toEqual(2);
        }
    });

    it('Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async () => {
        const app = <Application />;
        const products = [
            { id: 0, name: 'Cheese', price: 666 },
            { id: 1, name: 'Keyboard', price: 567 },
            { id: 2, name: 'Car', price: 34 },
        ];
        const { findAllByTestId } = render(app, {
            customPath: '/catalog',
            customData: products,
        });

        for (let product of products) {
            const { id, name, price } = product;
            const card = await findAllByTestId(id);
            const cardContainer = card[0];

            expect(card.length).toEqual(2);
            expect(
                within(cardContainer).getByRole('heading').textContent
            ).toEqual(name);
            expect(
                within(cardContainer).getByText(`$${price}`).textContent
            ).toEqual(`$${price}`);

            expect(
                within(cardContainer)
                    .getByRole('link', { name: 'Details' })
                    .getAttribute('href')
            ).toEqual(`/catalog/${id}`);
        }
    });

    it('На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину”', async () => {
        const app = <Application />;
        const product = {
            id: 5,
            name: 'Cheese',
            price: 245,
            color: 'Red',
            description: 'Description content',
            material: 'Carbon',
        };

        const { findByRole, findByText } = render(app, {
            customPath: '/catalog/5',
            customData: product,
        });

        expect((await findByRole('heading')).textContent).toEqual(product.name);
        expect(
            await findByRole('button', { name: 'Add to Cart' })
        ).toBeTruthy();
        expect(await findByText(product.color)).toBeTruthy();
        expect(await findByText(product.material)).toBeTruthy();
        expect(await findByText(product.description)).toBeTruthy();
    });

    it('Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
        const app = <Application />;
        const products = [
            { id: 0, name: 'Cheese', price: 666 },
            { id: 1, name: 'Keyboard', price: 567 },
            { id: 2, name: 'Car', price: 34 },
        ];
        const localStoreProducts = {
            '1': { count: 2, name: 'keyboard', price: 567 },
        };

        const user = userEvent.setup();

        const { findAllByTestId, findByText } = render(app, {
            customPath: '/catalog',
            customData: products,
            customStoreCart: JSON.stringify(localStoreProducts),
        });

        const currentCardData = await findAllByTestId(1);
        const currentContainer = currentCardData[0];
        expect(
            within(currentContainer).queryByText('Item in cart')
        ).toBeTruthy();

        const detailsLink = await within(currentContainer).findByRole('link', {name: 'Details'});
        user.click(detailsLink);

        expect(await findByText('Item in cart')).toBeTruthy();        
    });

    it('Cодержимое корзины сохраняется между перезагрузками страницы', async () => {
        const app = <Application />;

        const localStoreProducts = {
            '0': { count: 10, name: 'gloves', price: 555 },
            '1': { count: 2, name: 'apple', price: 50 },
        };

        const { findByTestId } = render(app, {
            customPath: '/cart',
            customStoreCart: JSON.stringify(localStoreProducts),
        });

        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });
        window.location.reload();

        expect(await findByTestId(0)).toBeTruthy();
        expect(await findByTestId(1)).toBeTruthy();
    });
});
