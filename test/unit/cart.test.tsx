import React from 'react';
import { describe, expect, it, jest } from '@jest/globals';
import { Application } from '../../src/client/Application';
import { fireEvent, render, within } from '../utils/test-utils';
import { CartApi } from '../../src/client/api';

describe('Тесты корзины', () => {
    it('В пустой корзине отображается ссылка на каталог', () => {
        const app = <Application />;

        const { getByRole } = render(app);

        const link = getByRole('link', { name: 'Cart' });
        fireEvent.click(link);

        const linkToCatalog = getByRole('link', {name: 'catalog'});
        expect(linkToCatalog.getAttribute('href')).toBe('/hw/store/catalog');
    });

    it('В шапке отображается кол-во неповторяющихся товаров', async () => {
        const app = <Application />;
        const localStoreProducts = {
            '0': { count: 10, name: 'gloves', price: 555 },
            '1': { count: 2, name: 'apple', price: 50 },
            '2': { count: 1, name: 'keyboard', price: 250 },
        };

        const { queryByText } = render(app, {
            customStoreCart: JSON.stringify(localStoreProducts),
        });

        expect(queryByText('Cart (3)')).toBeTruthy();
    });

    it('Все товары удаляются из корзины', () => {
        const app = <Application />;
        const localStoreProducts = {
            '0': { count: 10, name: 'gloves', price: 555 },
            '1': { count: 2, name: 'apple', price: 50 },
            '2': { count: 1, name: 'keyboard', price: 250 },
        };
        const customCartApi = new CartApi();
        customCartApi.setState = jest.fn();

        const { getByRole, queryByTestId } = render(app, {
            customPath: '/cart',
            customStoreCart: JSON.stringify(localStoreProducts),
            customCartApi: customCartApi,
        });

        const btn = getByRole('button', { name: 'Clear shopping cart' });
        fireEvent.click(btn);

        for (let i = 0; i < 3; i++) {
            expect(queryByTestId(0)).toBeNull();
        }

        expect(customCartApi.setState).toHaveBeenCalledTimes(1);
    });

    it('В корзине должна отображаться таблица с добавленными в нее товарами', () => {
        const app = <Application />;
        const localStoreProducts = {
            '0': { count: 10, name: 'gloves', price: 555 },
            '1': { count: 2, name: 'apple', price: 50 },
            '2': { count: 1, name: 'keyboard', price: 250 },
        };

        const { getByRole } = render(app, {
            customPath: '/cart',
            customStoreCart: JSON.stringify(localStoreProducts),
        });

        const table = getByRole('table');
        const rows = within(table).queryAllByRole('row');

        for (let i = 1; i < rows.length - 1; i++) {
            const row = rows[i];
            const testId: keyof typeof localStoreProducts = String(
                row.dataset.testid
            ) as keyof typeof localStoreProducts;

            expect(localStoreProducts[testId]).toBeTruthy();
        }
    });

    it('Для каждого товара должны отображаться название, цена, количество , стоимость, и общая сумма заказа', () => {
        const app = <Application />;
        const totalAmount = 6150;
        const localStoreProducts = {
            '0': { count: 10, name: 'gloves', price: 555 },
            '1': { count: 7, name: 'apple', price: 50 },
            '2': { count: 1, name: 'keyboard', price: 250 },
        };

        const { queryByText, getByTestId } = render(app, {
            customPath: '/cart',
            customStoreCart: JSON.stringify(localStoreProducts),
        });

        for (let id in localStoreProducts) {
            const { count, name, price } =
                localStoreProducts[id as keyof typeof localStoreProducts];
            const row = getByTestId(id);

            expect(within(row).queryByText(count)).toBeTruthy();
            expect(
                within(row).queryAllByText(`$${price}`).length
            ).toBeGreaterThan(0);
            expect(
                within(row).queryAllByText(`$${price * count}`).length
            ).toBeGreaterThan(0);
            expect(within(row).queryByText(name)).toBeTruthy();
        }

        expect(queryByText(`$${totalAmount}`)).toBeTruthy();
    });
});
