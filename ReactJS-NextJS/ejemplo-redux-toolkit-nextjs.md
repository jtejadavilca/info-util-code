# counterSlice.ts

```tsx
// /app/store/counter/counterSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
    count: number;
    isReady: boolean;
}

const initialState: CounterState = {
    count: 5,
    isReady: false,
};

const counterSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        initCounterState: (state, action: PayloadAction<number>) => {
            if (state.isReady) return;
            state.count = action.payload;
            state.isReady = true;
        },
        increment: (state) => {
            state.count++;
        },
        decrement: (state) => {
            if (state.count === 0) return;
            state.count--;
        },
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.count += action.payload;
        },
        resetCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload;
        },
    },
});

export const { initCounterState, increment, decrement, incrementByAmount, resetCount } = counterSlice.actions;

export default counterSlice.reducer;
```

# pokemonSlice.ts

```tsx
// /app/store/pokemons/pokemonSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SimplePokemon } from "@/pokemons";

/*
{
    '1': { id: 1, name: 'Bulbasaur', type: 'grass' },
    '2': { id: 2, name: 'Ivysaur', type: 'grass' },
    '3': { id: 3, name: 'Venusaur', type: 'grass' },
}
*/

interface PokemonState {
    //[key: string]: SimplePokemon;
    favorites: { [key: string]: SimplePokemon };
}

// const getInitialState = (): PokemonState => {
//     const favoritePokemons = localStorage.getItem("favoritePokemons");
//     if (favoritePokemons) {
//         return JSON.parse(favoritePokemons);
//     }
//     return {};
// };

const initialState: PokemonState = {
    favorites: {},
    //...getInitialState()
};

const pokemonSlice = createSlice({
    name: "pokemon",
    initialState,
    reducers: {
        setFavorites: (state, action: PayloadAction<{ [key: string]: SimplePokemon }>) => {
            state.favorites = action.payload;
        },
        toggleFavorite: (state, action: PayloadAction<SimplePokemon>) => {
            const { id } = action.payload;
            if (state.favorites[id]) {
                delete state.favorites[id];
            } else {
                state.favorites[id] = action.payload;
            }

            //! TODO No se debe interactuar con el localStorage directamente aquí
            // Se hace en el middleware
            //localStorage.setItem("favoritePokemons", JSON.stringify(state.favorites));
        },
    },
});

export const { setFavorites, toggleFavorite } = pokemonSlice.actions;

export default pokemonSlice.reducer;
```

# localstorage-middleware.ts

```tsx
// /app/store/middlewares/localstorage-middleware.ts
import { Action, Dispatch, Middleware, MiddlewareAPI } from "@reduxjs/toolkit";

export const localStoreMiddleware = (store: MiddlewareAPI) => {
    return (next: Dispatch) => (action: Action) => {
        const result = next(action);
        if (action.type === "pokemon/toggleFavorite") {
            localStorage.setItem("favoritePokemons", JSON.stringify(store.getState().pokemon.favorites));
        }
        return result;
    };
};
```

# index.ts

```tsx
// /app/store/index.ts

import { configureStore, Middleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import counterSlice from "./counter/counterSlice";
import pokemonSlice from "./pokemons/pokemonSlice";
import { localStoreMiddleware } from "./middlewares/localstorage-middleware";

export const store = configureStore({
    reducer: {
        counter: counterSlice,
        pokemon: pokemonSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStoreMiddleware as Middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch; //useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

# Providers.tsx

```tsx
// /app/store/Providers.tsx
"use client"; // Tomar en cuenta que este archivo se ejecuta en el cliente
import { Provider } from "react-redux";
import { store } from ".";
import { useEffect } from "react";
import { setFavorites } from "./pokemons/pokemonSlice";

interface Props {
    children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
    useEffect(() => {
        const favoritePokemons = JSON.parse(localStorage.getItem("favoritePokemons") || "{}");
        store.dispatch(setFavorites(favoritePokemons));
    }, []);

    return <Provider store={store}>{children}</Provider>;
};
```

# layout.tsx

Este archivo es el que envolverá la funcionalidad de la aplicación con el manejo de estado global. Para ello incluirá el componente `Providers` que se encargará de proveer el estado global a la aplicación.

```tsx
// /app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/store/Providers";

const geistSans = localFont({
    src: "../fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "../fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
```
