import React, { ReactElement, ReactNode } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter, Router, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { RenderOptions, RenderResult } from '@testing-library/react';
import axios from 'axios';
import { CartState, CheckoutFormData } from '../../src/common/types';
import { jest } from '@jest/globals';

jest.mock('axios');
export const mockedAxios = axios as jest.Mocked<typeof axios>;

export class CustomApi extends ExampleApi {
    _basename: string;
    _checkoutId: number;
    _customData: unknown;

    constructor(basename: string, customData: unknown) {
        super(basename);
        this._basename = basename;
        this._checkoutId = 0;
        this._customData = customData;
    }

    async getProducts() {
        const mockData = this._customData
            ? this._customData
            : [
                  { id: 0, name: 'First car', price: 666 },
                  { id: 1, name: 'Second keyboard', price: 567 },
                  { id: 2, name: 'Third soap', price: 34 },
              ];
        mockedAxios.get.mockResolvedValue({ data: mockData });

        return super.getProducts();
    }

    async getProductById(id: number) {
        let mockData: Record<string, unknown> = {};

        if (this._customData) {
            mockData = Array.isArray(this._customData)
                ? this._customData.find((item) => item.id === id)
                : this._customData;
        } else {
            mockData = { id: id, name: 'Cheese', price: 245 };
        }

        if (!mockData.color || !mockData.description || !mockData.material) {
            mockData = {
                ...mockData,
                color: 'red',
                description: 'description content',
                material: 'carbon',
            };
        }

        mockedAxios.get.mockResolvedValue({ data: mockData });

        return super.getProductById(id);
    }

    async checkout(form: CheckoutFormData, cart: CartState) {
        this._checkoutId += 1;
        const mockData = { id: this._checkoutId };
        mockedAxios.post.mockResolvedValue({ data: mockData });

        return super.checkout(form, cart);
    }
}

const StoreProvider = ({
    data,
    customCartApi,
    children,
}: {
    data: unknown;
    children?: React.ReactNode;
    customCartApi?: unknown;
}) => {
    const basename = '/hw/store';
    const api = new CustomApi(basename, data);
    const cart = customCartApi ? (customCartApi as CartApi) : new CartApi();
    const store = initStore(api, cart);

    return <Provider store={store}>{children}</Provider>;
};

const InitialRouter = ({ children }: { children: ReactNode }) => {
    const basename = '/hw/store';

    return <BrowserRouter basename={basename}>{children}</BrowserRouter>;
};

const CustomRouter = ({
    path,
    children,
}: {
    path: string;
    children: ReactNode;
}) => {
    const customPath = path;

    return (
        <MemoryRouter initialEntries={[customPath]}>{children}</MemoryRouter>
    );
};

type ExtendedRenderOptions = RenderOptions & {
    customPath?: string;
    customData?: unknown;
    customStoreCart?: string;
    customCartApi?: unknown;
};

const customRender = (
    ui: ReactElement,
    options?: ExtendedRenderOptions
): RenderResult => {
    window.localStorage.clear();
    window.localStorage.setItem(
        'example-store-cart',
        options?.customStoreCart || ''
    );

    return render(ui, {
        wrapper: (props) => {
            if (options?.customPath) {
                return (
                    <CustomRouter path={options.customPath}>
                        <StoreProvider
                            data={options.customData}
                            customCartApi={options?.customCartApi}
                        >
                            {props.children}
                        </StoreProvider>
                    </CustomRouter>
                );
            } else {
                return (
                    <InitialRouter>
                        <StoreProvider
                            data={options?.customData}
                            customCartApi={options?.customCartApi}
                        >
                            {props.children}
                        </StoreProvider>
                    </InitialRouter>
                );
            }
        },
        ...options,
    });
};

// re-export everything
export * from '@testing-library/react';

export { customRender as render };
