# Utils info and commands to handle ReactJS projects

## Creating a ReactJS project (using vite and yarn)

> yarn must be installed, otherwise, the command is: `npm install --global yarn`

Command to create a ReactJS project:

```
yarn create vite
```

Then set the project name and select "React" in the option list.

## Adding "react-router-dom"

```
yarn add react-router-dom
```

## Adding Tailwind to a reactjs project

Command to install tailwind:

```
yarn add -D tailwindcss postcss autoprefixer
```

Command to generate the `tailwind.config.js` and `postcss.config.js`

```
npx tailwindcss init -p
```

Add the paths to all of your template files in your `tailwind.config.js` file:

```
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ]
}
```

Add the tailwind directives to your CSS (it could be in `./src/index.css`):

```
@tailwind base
@tailwind components
@tailwind utilities
```

## Adding libraries for unit tests

Command to install:

```
yarn add --dev jest babel-jest @babel/preset-env @babel/preset-react
yarn add --dev @testing-library/react @types/jest jest-environment-jsdom
```

### Si se está usando el `fetch`, es necesario instalar lo siguiente:

```
yarn add --dev whatwg-fetch
```

### Luego adicionar el comando 'test' en _scripts_ dentro del archivo `package.json`:

```
"scripts: {
  ...
  "test": "jest --watchAll"
```

### Luego se necesita crear los siguientes archivos de configuración:

#### Archivo _babel.config.cjs_ con contenido:

```
module.exports = {
    presets: [
        [ '@babel/preset-env', { targets: { esmodules: true } } ],
        [ '@babel/preset-react', { runtime: 'automatic' } ],
    ],
};
```

#### Archivo _jest.config.js_ con contenido:

```
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['./jest.setup.js']
}
```

#### Archivo _jest.setup.js_ con contenido (Este archivo dio error al correr los test, es mejor no usarlo ni referenciarlo en el archivo _jest.config.js_):

#### Archivo _jest.setup.js_ con contenido (Este archivo dio error al correr los test, es mejor no usarlo ni referenciarlo en el archivo _jest.config.js_):

```
// En caso de necesitar la implementación del FetchAPI
import 'whatwg-fetch'; // <-- yarn add whatwg-fetch
```

### Ejemplo de test en archivo _useCounter.test.js_:

```javascript
import { act, renderHook } from "@testing-library/react";
import { useCounter } from "../../src/hooks/useCounter";

describe("useCounter", () => {
    it("Debe retornar los valores por defecto", () => {
        const { result } = renderHook(() => useCounter());

        const { counter } = result.current;
        expect(counter).toBe(10);
    });

    it('Debe retornar el valor de counter incrementado en uno al usar la función "increment"', () => {
        const { result } = renderHook(() => useCounter(1));

        act(() => result.current.increment());

        const { counter } = result.current;
        expect(counter).toBe(2);
    });

    it('Debe retornar el valor de counter decrementado en uno al usar la función "decrement"', () => {
        const { result } = renderHook(() => useCounter(3));

        act(() => result.current.decrement());

        const { counter } = result.current;
        expect(counter).toBe(2);
    });
});
```

# Installing Redux Toolkit and React-Redux:

### npm:

```
npm install @reduxjs/toolkit react-redux
```

### yarn:

```
yarn add @reduxjs/toolkit react-redux
```
