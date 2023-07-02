import React from 'react';
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '../utils/test-utils';
import { Application } from '../../src/client/Application';
import userEvent from '@testing-library/user-event';

describe('Общие требования', () => {
    it('В шапке есть ссылки на страницы магазина и корзину', () => {
        const app = <Application />;
        const { getByRole } = render(app);

        const getLinks = () => {
            const result: Record<string, HTMLElement> = {};
            result.mainLink = getByRole('link', { name: 'Example store' });
            result.catalogLink = getByRole('link', { name: 'Catalog' });
            result.deliveryLink = getByRole('link', { name: 'Delivery' });
            result.contactsLink = getByRole('link', { name: 'Contacts' });
            result.cartLink = getByRole('link', { name: 'Cart' });
            return result;
        };

        const checkLinks = ({
            mainLink,
            catalogLink,
            deliveryLink,
            contactsLink,
            cartLink,
        }: Record<string, HTMLElement>) => {
            expect(mainLink.getAttribute('href')).toBe('/hw/store/');
            expect(catalogLink.getAttribute('href')).toBe('/hw/store/catalog');
            expect(deliveryLink.getAttribute('href')).toBe(
                '/hw/store/delivery'
            );
            expect(contactsLink.getAttribute('href')).toBe(
                '/hw/store/contacts'
            );
            expect(cartLink.getAttribute('href')).toBe('/hw/store/cart');
        };

        for (let link of Object.values(getLinks())) {
            fireEvent.click(link);
            const currentLinks = getLinks();
            checkLinks(currentLinks);
        }
    });

    it('При выборе эл-та из бургера, он скрывается', async () => {
        const app = <Application />;

        const user = userEvent.setup();
        const { container, getByRole, getAllByRole } = render(app);

        const navContainer = container.querySelector('.navbar-collapse');
        const burgerMenuBtn = getAllByRole('button', {}).find((btn) =>
            btn.classList.contains('navbar-toggler')
        ) as HTMLElement;

        expect(navContainer?.classList.contains('collapse')).toBeTruthy();

        await user.click(burgerMenuBtn);

        expect(navContainer?.classList.contains('collapse')).toBeFalsy();

        const catalogLink = getByRole('link', { name: 'Catalog' });

        await user.click(catalogLink);

        expect(navContainer?.classList.contains('collapse')).toBeTruthy();
    });
});
