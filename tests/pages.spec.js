import { test, expect } from '@playwright/test';

test('Основная страница отображается корректно', async ({ page }) => {
    await page.goto('/hw/store?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});
test('Страница товара отображается корректно', async ({ page }) => {
    await page.route(
        'http://localhost:3000/hw/store/api/products/0',
        async (route) => {
            const json = {
                id: 0,
                name: 'Cheese',
                price: 500,
                color: 'red',
                description: 'description',
                material: 'wood',
            };
            await route.fulfill({ json });
        }
    );
    await page.goto('/hw/store/catalog/0?bug_id=' + process.env.BUG_ID);

    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot();
});
test('Страница каталога отображается корректно', async ({ page }) => {
    await page.route(
        'http://localhost:3000/hw/store/api/products',
        async (route) => {
            const json = [
                { id: 0, name: 'Cheese', price: 500 },
                { id: 1, name: 'Chicken', price: 500 },
                { id: 2, name: 'Gloves', price: 500 },
            ];
            await route.fulfill({ json });
        }
    );
    await page.goto('/hw/store/catalog?bug_id=' + process.env.BUG_ID);

    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot();
});
test('Страница доставки отображается корректно', async ({ page }) => {
    await page.goto('/hw/store/delivery?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});
test('Страница контактов отображается корректно', async ({ page }) => {
    await page.goto('/hw/store/contacts?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});
test('Страница корзины отображается корректно', async ({ page }) => {
    await page.goto('/hw/store/cart?bug_id=' + process.env.BUG_ID);
    await expect(page).toHaveScreenshot();
});

test('Чекаут формы корзины работает', async ({ page }) => {
    await page.route(
        'http://localhost:3000/hw/store/api/products/0',
        async (route) => {
            const json = {
                id: 0,
                name: 'Cheese',
                price: 500,
                color: 'red',
                description: 'description',
                material: 'wood',
            };
            await route.fulfill({ json });
        }
    );

    await page.route(
        'http://localhost:3000/hw/store/api/checkout',
        async (route) => {
            const json = {
                id: 1,
            };
            await route.fulfill({ json });
        }
    );
    await page.goto('/hw/store/catalog/0?bug_id=' + process.env.BUG_ID);

    const addBtn = page.getByRole('button', { name: 'Add to Cart' });
    await addBtn.click();

    const cartLink = page.getByRole('link', { name: 'Cart (1)' });
    await cartLink.click();

    const inputs = await page.getByRole('textbox').all();
    await inputs[0].fill('name');
    await inputs[1].fill('89998887766');
    await inputs[2].fill('description');

    const btn = page.getByRole('button', { name: 'Checkout' });
    await btn.click();

    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot();
});

test('Корзина очищается', async ({ page }) => {
    await page.route(
        'http://localhost:3000/hw/store/api/products/0',
        async (route) => {
            const json = {
                id: 0,
                name: 'Cheese',
                price: 500,
                color: 'red',
                description: 'description',
                material: 'wood',
            };
            await route.fulfill({ json });
        }
    );

    await page.goto('/hw/store/catalog/0?bug_id=' + process.env.BUG_ID);

    const addBtn = page.getByRole('button', { name: 'Add to Cart' });
    await addBtn.click();

    const cartLink = page.getByRole('link', { name: 'Cart (1)' });
    await cartLink.click();

    const clearBtn = page.getByRole('button', { name: 'Clear shopping cart' });
    await clearBtn.click();

    await expect(page).toHaveScreenshot();
});