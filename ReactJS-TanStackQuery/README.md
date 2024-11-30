# TanStackQuery

#### Powerful asynchronous state management for TS/JS, React, Solid, Vue, Svelte and Angular.

Toss out that granular state management, manual refetching and endless bowls of async-spaghetti code. TanStack Query gives you declarative, always-up-to-date auto-managed queries and mutations that directly improve both your developer and user experiences.

## Installation

-   npm:

```bash
npm i @tanstack/react-query
```

-   yarn:

```bash
yarn add @tanstack/react-query
```

-   CDN:

```html
<script type="module">
    import React from "https://esm.sh/react@18.2.0";
    import ReactDOM from "https://esm.sh/react-dom@18.2.0";
    import { QueryClient } from "https://esm.sh/@tanstack/react-query";
</script>
```

### Optinal (and recommended installation):

#### ESLint Plugin Query:

-   npm

```bash
npm i -D @tanstack/eslint-plugin-query
```

-   yarn

```bash
yarn add -D @tanstack/eslint-plugin-query
```

#### DevTools:

-   npm

```bash
npm i @tanstack/react-query-devtools
```

-   yarn

```bash
yarn add @tanstack/react-query-devtools
```

## Quick Start

Adding the QueryClientProvider at the highest component level

<details>
<summary>Example 1 main.tsx</summary>

```tsx
import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { router } from "./router";

import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />

            <ReactQueryDevtools />
        </QueryClientProvider>
    </React.StrictMode>
);
```

</details>

<details>
<summary>Example 2</summary>

```tsx
// src/plugins/TanStackProvider.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const queryClient = new QueryClient();
export const TanStackProvider = ({ children }: React.PropsWithChildren) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
```

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";

import { NextUIProvider } from "@nextui-org/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/router.tsx";

import "./index.css";
import { TanStackProvider } from "./plugins";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <TanStackProvider>
            <NextUIProvider>
                <main className="dark text-foreground bg-background">
                    <RouterProvider router={router} />
                </main>
            </NextUIProvider>
        </TanStackProvider>
    </React.StrictMode>
);
```

</details>

### Including DevTools de TanStackQuery

```tsx
// src/plugins/TanStackProvider.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

const queryClient = new QueryClient();
export const TanStackProvider = ({ children }: React.PropsWithChildren) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}

            {/* Need to add the following line */}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};
```

### How to use it:

1. Creating a file to handle the communication with an API:

Example:

```tsx
// src/product
import axios from "axios";

const API_URL = `http://localhost:3100`;

const productsApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export { productsApi };
```

2. Creating a hook which uses the api call file:

Example:

```tsx
import { useQuery } from "@tanstack/react-query";
import { productActions } from "../";

interface Options {
    filterKey?: string;
}

export const useProducts = ({ filterKey }: Options) => {
    const {
        isLoading,
        isFetching,
        isError,
        error,
        data: products,
    } = useQuery({
        queryKey: ["products", filterKey],
        queryFn: () => productActions.getProducts({ filterKey }),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    return {
        isLoading,
        isFetching,
        isError,
        error,
        products,
    };
};
```

3. Using hook to get the data:

```tsx
// src/products/pages/CompleteListPage.tsx
import { ProductList, useProducts } from "..";

export const CompleteListPage = () => {
    const { isLoading, products } = useProducts({ filterKey: "all" });
    return (
        <div className="flex-col">
            <h1 className="text-2xl font-bold">Todos los productos</h1>

            {isLoading && <p>Cargando...</p>}

            <ProductList products={products} />
        </div>
    );
};
```

4. Component using the data:

```tsx
// src/products/components/ProductList.tsx
import { FC } from "react";
import { Product, ProductCard } from "..";

interface ProductListProps {
    products: Product[];
}

export const ProductList: FC<ProductListProps> = ({ products }) => {
    return (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 justify-center max-w-max">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
```

### Prefetching an element:

1. Creating a hook (Eg.: `usePrefetchProduct.tsx`):

```tsx
// src/products/hooks/usePrefetchProduct.tsx
import { useQueryClient } from "@tanstack/react-query";
import { productActions } from "..";

export const usePrefetchProduct = () => {
    const queryClient = useQueryClient();

    const preFetchProduct = async (id: number) => {
        queryClient.prefetchQuery({
            queryKey: ["product", id],
            queryFn: () => productActions.getProduct({ id }),
            staleTime: 1000 * 60 * 10, // 10 minutes
        });
    };

    return preFetchProduct;
};
```

2. Calling usePrefetchProduct:

```tsx
import { FC } from "react";
import { Product, ProductCard, usePrefetchProduct } from "..";

interface ProductListProps {
    products: Product[];
}

export const ProductList: FC<ProductListProps> = ({ products }) => {
    const prefetchProduct = usePrefetchProduct();
    return (
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 justify-center max-w-max">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} prefetchProduct={prefetchProduct} />
            ))}
        </div>
    );
};
```

3. Using the prefetch:
```tsx
<Link to={`/product/${product.id}`} onMouseEnter={() => prefetchProduct && prefetchProduct(product.id)}>
    <Card className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3 max-w-xs md:max-w-3xl mx-auto border border-white bg-white">
        ...
    </Card>
</Link>
```

