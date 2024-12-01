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

> Recomendaciones al crear el proyecto:
>
> -   Typescript? _YES_
> -   ESLint? _YES_
> -   Tailwind? _YES_
> -   src/ directory? _NO_ <small>src/ es la forma antigua</small>
> -   Tailwind? _YES_
> -   AppRouter? _YES_ <small>Nueva forma de trabajar con NextJS</small>
> -   Alias? _NO_

## Running the development server

Dentro de la carpeta del proyecto, puedes iniciar el servidor de desarrollo:

```bash
npm run dev
```

Esto abrirá tu aplicación en [http://localhost:3000](http://localhost:3000).

## Building the project for production

Para generar una versión de producción optimizada:

```bash
npm run build
```

Para iniciar el servidor en producción:

```bash
npm run start
```

## Adding `react-icons` for icons

Instala la librería:

```bash
npm install react-icons
```

Usar un ícono en un componente:

```javascript
import { FaReact } from "react-icons/fa";

export default function IconExample() {
    return <FaReact size={32} color="blue" />;
}
```

## Manejo de rutas en NextJS

NextJS maneja las rutas basado en sus carpetas y en archivos de nombre `page.tsx`, por ejemplo,\
si dentro de la carpeta `app` tenemos una carpeta `dashboard` y dentro de esta tenemos un archivo\
llamado `page.tsx`, entonces podremos acceder a dicha página con la siguiente ruta:\
`http://localhost:3000/dashboard`, y el contenido que se mostrará lo que está en `page.tsx`

### Ejemplo de `page.tsx`:

```ts
// /app/dashboard/page.tsx
import { TabBar } from "@/components";

export const metadata = {
    title: "Cookies Page",
    description: "Cookies",
};

export default function CookiesPage() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
                <span className="text-3xl">Tabs</span>
                <TabBar />
            </div>
        </div>
    );
}
```

## Layout: Estructura que envuelve las páginas

NextJS permite manejar un mismo _layout_ para varias páginas, lo que significa que se puede hacer solo\
la parte de contenido de las páginas y que todas compartan la estructura general.

Por ejemplo, si tenemos tres archivos `page.tsx` de la siguiente forma:

-   `/app/dashboard/page.tsx`
-   `/app/products/page.tsx`
-   `/app/contact/page.tsx`

Y un layout en la ruta `/app/layout.tsx`, significa que **los tres archivos de arriba compartiran el mismo layout**

> IMPORTANTE: Si en el ejemplo anterior hubiese un layout en la ruta `/app/products/layout.tsx`, entonces, la página \
> que está dentro de productos, (`/app/products/page.tsx`) será envuelto primero por **ese** layout y este a su vez será envuelto \
> por el que está indicado en el ejemplo, ya que sería el más cercado a dicha página.

## Agrupando páginas

Es posible agrupar páginas o carpetas con páginas dentro de una carpeta (con cualquier nombre) y para que dicha carpeta no sea parte \
de la URL, el nombre de esta debe estar entre paréntesis. \
Ejemplo:

-   `/app/(grupo)/dashboard/page.tsx`
-   `/app/(grupo)/products/page.tsx`
-   `/app/(grupo)/contact/page.tsx`

Al tener la estructura de arriba, no será necesario incluir el nombre de la carpeta `grupo` en la URL, por tanto,\
para acceder a ellas será con los siguientes urls, respectivamente:

-   `http://localhost:3000/dashboard/page.tsx`
-   `http://localhost:3000/products/page.tsx`
-   `http://localhost:3000/contact/page.tsx`

Dicha organización de carpetas podría ser útil para que, por ejemplo, las tres páginas sean envueltas por un único layout,\
y para ello, se colocaría el archivo en la siguiente ruta: `/app/(grupo)/layout.tsx`

## Server Components

Todos los componentes que creamos en NextJS son generados en el lado del servidor (a menos que al inicio de un componente\
se declare `use client`). Por tanto, **no es posible usar hooks de ReactJS** (_como useState, useEffect, useCallback, etc_) en estos componentes.\
Para el uso de estos hooks usamos Client Components (aquellos que son declarados con `use client`).

Considerar que al ser server components, es posible acceder directamente a funcionalidades del servidor, como por ejemplo BD.

## Enlaces en la aplicación con NextJS (&lt;Link>)

En NextJS no es recomendable usar los anchor tag (&lt;a>&lt;/a>) directamente para enlaces; para esos casos tenemos un componente\
propio de NextJS llamado &lt;Link>, <small>(Se importa así: `import Link from "next/link";`)</small> el cual genera enlaces que no hacen recargar la\
página (aparente ser un Single Page).

## Imágenes en la aplicación con NexstJS (&lt;Image>)

En NextJS no es recomendable usar directamente el tag &lt;img> puesto que de esa manera no lo puede optimizar, por tanto, para ello\
NextJS tiene un etiqueta especial llamada &lt;Image>, <small>(Se importa así: `import Image from "next/image";`)</small> la cual inserta\
imágenes optimizadas adecuadamente.\
Ejemplo:

```ts
import Image from "next/image";
export default function Page() {
    return <Image src="/profile.png" width={500} height={500} alt="Picture of example" />;
}
```

> NOTA: Si se requiere insertar una imagen externa usando la url, esta se deberá declarar en el archivo `next.config.ts`,por ejemplo,\
> si se quisiera incluir la imagen `src='https://roastme.ru/some-path/some-image.jpg'`, se debe declarar de la siguiente forma:
>
> ```ts
> import type { NextConfig } from "next";
>
> const nextConfig: NextConfig = {
>     /* config options here */
>     images: {
>         remotePatterns: [
>             {
>                 protocol: "https",
>                 hostname: "roastme.ru",
>             },
>         ],
>     },
> };
>
> export default nextConfig;
> ```
>
> ---

## Error handling

Next.js permite manejar errores en la aplicación con un archivo especial llamado `error.tsx` el cual manejará el error\
según en la carpeta que se encuentre. Por ejemplo, si se tiene un archivo `error.tsx` en la carpeta `app`, entonces este\
manejará los errores de todas las páginas que estén dentro de la carpeta `app`. Si se tiene un archivo `error.tsx` en la\
carpeta `app/products`, entonces este manejará los errores de todas las páginas que estén dentro de la carpeta `app/products`.

> IMPORTANTE: Los archivos `error.tsx` tienen que ser manejados al lado del cliente, por tanto, se debe declarar `use client` al inicio del archivo.

Ejemplo de un archivo `error.tsx`:

```ts
// /app/products/error.tsx
"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div>
            <h2>Someting went wrong</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>Reset</button>
        </div>
    );
}
```

## Rutas dinámicas (con argumentos)

En NextJS es posible recibir argumentos en la URL, y esto requiere que se use ruta creando carpetas cuyo nombres estén dentro de corchetes, por ejemplo:

-   `/app/products/[id]/page.tsx`

Dentro de la carpeta `products` estara una carpeta llamada `[id]` y dentro de esta estará el archivo `page.tsx`, y en este último archivo (que será la página a la que se accede), se podrá recibir el argumento `id` de la siguiente forma:

```ts
// /app/products/[id]/page.tsx
interface Props {
    params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: Props) {
    const { id } = await params;
    return <div>Product ID: {id}</div>;
}
```

## Page NOT FOUND (404)

NextJS permite redireccionar a una página 404 personalizada, para ello se debe crear un archivo `not-found.tsx` en la carpeta en la que, por ejemplo, se reciba un id para buscar en BD y que pueda no existir dicha entidad, por tanto, NextJS manejará el error y redireccionar automáticamente a la página 404 (`not-found.tsx`).

Ejemplo de un archivo `not-found.tsx`:

```ts
// /app/products/not-found.tsx
import Link from "next/link";

export default function NotFoundPage() {
    return (
        <main className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
            <h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
            <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">Page Not Found</div>
            <button className="mt-5">
                <a className="relative inline-block text-sm font-medium text-[#FF6A3D] group active:text-orange-500 focus:outline-none focus:ring">
                    <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0"></span>

                    <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
                        <Link href="/">Go Home</Link>
                    </span>
                </a>
            </button>
        </main>
    );
}
```

La forma para redireccionar a la página 404 es con el siguiente código:

```ts
// /app/products/[id]/page.tsx
import { notFound } from "next/navigation";
// ...

export default async function DetailPage({ params }: Props) {
    // ...
    if (!product) {
        return notFound(); // <-- This line is responsible for redirecting to the 404 page
    }
    // ...
}
```

## Creating API routes in Next.js

Next.js permite manejar API dentro de la carpeta `/pages/api`. Por ejemplo:

### Archivo `/pages/api/hello.ts`:

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
