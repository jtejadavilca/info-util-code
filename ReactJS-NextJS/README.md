# Utils info and commands to handle Next.js projects

## What is Next.js?

Next.js es un framework de React que permite construir aplicaciones web modernas con características avanzadas como renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG), enrutamiento basado en archivos y mucho más. Está diseñado para ofrecer un excelente rendimiento y facilitar el desarrollo de aplicaciones web. [Ir a la documentación](https://nextjs.org/docs)

> NOTA: Existen dos sintaxis de NextJS, ambas sintaxis están vigentes, pero la más actual (desde versión +13) es la primera (es en la que se enfoca este manual):
>
> -   **App router** <small>_(la más actual)_</small>
> -   **Page router** <small>_(sintaxis anterior)_</small>

## Algunas características a considerar:

-   En NextJS se puede usar todo lo que se sabe de ReactJS, ademas
-   Aprovechar las mejoras en rendimiento al cargar solo lo necesario
-   Aplicar SEO (_es SEO friendly_)
-   Separación de código
-   Router
-   Dependencias y más

## Creating a Next.js project (using npx and yarn)

### Using `npx`:

```bash
npx create-next-app@latest
```

O puedes especificar el nombre del proyecto y la plantilla:

```bash
npx create-next-app@latest my-next-app --typescript
```

### Using `yarn`:

```bash
yarn create next-app
```

Si deseas usar TypeScript:

```bash
yarn create next-app my-next-app --typescript
```

## Running the development server

Dentro de la carpeta del proyecto, puedes iniciar el servidor de desarrollo:

```bash
yarn dev
```

Esto abrirá tu aplicación en [http://localhost:3000](http://localhost:3000).

## Building the project for production

Para generar una versión de producción optimizada:

```bash
yarn build
```

Para iniciar el servidor en producción:

```bash
yarn start
```

## Adding Tailwind CSS to a Next.js project

### Installation:

```bash
yarn add -D tailwindcss postcss autoprefixer
```

Inicializa los archivos de configuración de Tailwind:

```bash
npx tailwindcss init -p
```

### Configuring `tailwind.config.js`:

Asegúrate de que Tailwind escanee tus archivos Next.js:

```javascript
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

### Adding Tailwind directives:

Añade las directivas de Tailwind en el archivo `./styles/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Adding `react-icons` for icons

Instala la librería:

```bash
yarn add react-icons
```

Usar un ícono en un componente:

```javascript
import { FaReact } from "react-icons/fa";

export default function IconExample() {
    return <FaReact size={32} color="blue" />;
}
```

## Creating API routes in Next.js

Next.js permite manejar API dentro de la carpeta `/pages/api`. Por ejemplo:

### Archivo `/pages/api/hello.js`:

```javascript
export default function handler(req, res) {
    res.status(200).json({ message: "Hello from Next.js API!" });
}
```

Puedes acceder a esta ruta en [http://localhost:3000/api/hello](http://localhost:3000/api/hello).

## Adding TypeScript to an existing project

Si tu proyecto fue creado sin TypeScript, puedes configurarlo fácilmente:

1. Instala las dependencias necesarias:

    ```bash
    yarn add -D typescript @types/react @types/node
    ```

2. Ejecuta el proyecto, y Next.js generará automáticamente un archivo `tsconfig.json`:

    ```bash
    yarn dev
    ```

3. Renombra archivos `.js` a `.tsx` según sea necesario.

## Deployment

Next.js es compatible con varios servicios de despliegue, como Vercel, Netlify y AWS.

### Deployment to Vercel:

1. Instala la CLI de Vercel:

    ```bash
    yarn global add vercel
    ```

2. Despliega tu proyecto:

    ```bash
    vercel
    ```

3. Sigue las instrucciones para vincular el proyecto.

## Adding tests with Jest

### Install Jest and Testing Library:

```bash
yarn add --dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Configure Jest:

Crea un archivo `jest.config.js`:

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);
```

### Add a setup file:

Crea `jest.setup.js` con el siguiente contenido:

```javascript
import "@testing-library/jest-dom";
```

### Running tests:

Ejecuta todos los tests:

```bash
yarn test
```

## Examples and best practices

1. **Dynamic Routes**: Next.js soporta rutas dinámicas fácilmente con brackets (`[ ]`). Ejemplo:

    Archivo: `/pages/post/[id].js`

    ```javascript
    import { useRouter } from "next/router";

    export default function Post() {
        const { query } = useRouter();
        return <div>Post ID: {query.id}</div>;
    }
    ```

2. **Server-Side Rendering (SSR):**

    ```javascript
    export async function getServerSideProps() {
        const data = await fetch("https://api.example.com/data").then((res) => res.json());
        return { props: { data } };
    }

    export default function Page({ data }) {
        return <div>{JSON.stringify(data)}</div>;
    }
    ```

3. **Static Generation (SSG):**

    ```javascript
    export async function getStaticProps() {
        const data = await fetch("https://api.example.com/data").then((res) => res.json());
        return { props: { data } };
    }

    export default function Page({ data }) {
        return <div>{JSON.stringify(data)}</div>;
    }
    ```

4. **API Calls with SWR:**

    Instala SWR:

    ```bash
    yarn add swr
    ```

    Uso en un componente:

    ```javascript
    import useSWR from "swr";

    const fetcher = (url) => fetch(url).then((res) => res.json());

    export default function Example() {
        const { data, error } = useSWR("/api/data", fetcher);

        if (error) return <div>Failed to load</div>;
        if (!data) return <div>Loading...</div>;

        return <div>{JSON.stringify(data)}</div>;
    }
    ```
