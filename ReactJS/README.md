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

Sometimes, componentes (.jsx files) requires event handling and we could receive this error: `Cannot find module '@testing-library/dom' from 'node_modules/@testing-library/react/dist/pure.js'`
So, in order to fix it, according to [the documentation](https://testing-library.com/docs/user-event/install), we need to install this libraries:
```
yarn add --dev @testing-library/user-event @testing-library/dom
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

#### Archivo _jest.config.cjs_ con contenido:

```
module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    setupFiles: ['./jest.setup.js']
}
```

#### Archivo _jest.setup.js_ con contenido (Este archivo dio error al correr los test, es mejor no usarlo ni referenciarlo en el archivo _jest.config.js_):

#### UPDATE: No debería dar error, sólo se necesita instalar `yarn add --dev whatwg-fetch` según se indica líneas arriba. Solo tomar en cuenta que al instalar ese u otro paquete, la aplicación no debe estar corriendo, sino no va a instalar bien.

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

# Installing Firebase:

## Need to install firebase in the project:

### npm

```
npm install firebase
```

### yarn

```
yarn add firebase
```

## Need also to add `.env` file with firebase project info, like:

```yml
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_DATABASE_URL=your_database_url
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```
