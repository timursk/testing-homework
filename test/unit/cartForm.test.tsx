import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { Application } from '../../src/client/Application';
import { fireEvent, render, within } from '../utils/test-utils';

describe('Форма корзины', () => {
    it('Форма валидирует поля', () => {
        const app = <Application />;
        const localStoreProducts = {
            '0': { count: 10, name: 'gloves', price: 555 },
            '1': { count: 2, name: 'apple', price: 50 },
            '2': { count: 1, name: 'keyboard', price: 250 },
        };

        const { getByRole, getAllByRole } = render(app, {
            customPath: '/cart',
            customStoreCart: JSON.stringify(localStoreProducts),
        });

        const inputs = getAllByRole('textbox') as HTMLInputElement[];
        const nameInput = inputs[0];
        const phoneInput = inputs[1];
        const addressInput = inputs[2];

        const acceptBtn = getByRole('button', { name: 'Checkout' });
        fireEvent.click(acceptBtn);

        expect(nameInput.classList.contains('is-invalid')).toBeTruthy();
        expect(phoneInput.classList.contains('is-invalid')).toBeTruthy();
        expect(addressInput.classList.contains('is-invalid')).toBeTruthy();

        fireEvent.input(nameInput, { target: { value: 'somename' } });
        fireEvent.input(phoneInput, { target: { value: '79998887766' } });
        fireEvent.input(addressInput, { target: { value: 'someaddress' } });
        fireEvent.click(acceptBtn);

        expect(nameInput.classList.contains('is-invalid')).toBeFalsy();
        expect(phoneInput.classList.contains('is-invalid')).toBeFalsy();
        expect(addressInput.classList.contains('is-invalid')).toBeFalsy();
    });
});
