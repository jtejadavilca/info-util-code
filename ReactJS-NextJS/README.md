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
> -   src/ directory? _YES_
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

## Metadata dinámica

NextJS permite crear metadata dinámica para las páginas que se requiera (No todas requieren metadata dinámica), para ello se debe crear un méodo\
en la página que se necesite esta dinámicamente, y dicho método debe llamarse "generateMetadata" y debe retornar un objeto con las propiedades `title` y `description`.

Ejemplo de un archivo `page.tsx` con metadata dinámica:

```ts
// /app/products/[id]/page.tsx

export async function generateMetadata({ params }) {
    const { id } = params;
    const product = await fetchProduct(id); // Esta llamada puede ser a BD o un servicio externo
    return {
        title: product.name,
        description: product.description,
    };
}

export default function DetailPage({ product }) {
    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
        </div>
    );
}
```

## Generación automática de páginas estáticas

Es posible generar páginas estáticas en NextJS en tiempo de compilación, para ello se debe crear un método llamado `generateStaticParams` en el archivo de la página que se requiera generar estáticamente, y este método debe retornar un objeto con la propiedad `props` que contenga los datos que la página necesita para generarse.

Ejemplo de un archivo `page.tsx` con generación automática de páginas estáticas:

```ts
// /app/products/[id]/page.tsx

export async function generateStaticParams() {
    const productIds = await fetchProductIds({ limit: 100 }); // Este método trae los 100 primeros ids de productos para generar sus páginas estáticas
    const data = productIds.map((productId) => ({ id: productId }));
    return data;
}

export default function DetailPage({ product }) {
    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
        </div>
    );
}
```

> NOTA: A pesar de tener páginas estáticas previamente creadas en tiempo de compilación, es posible que se requiera que una página se genere en tiempo de ejecución,\
> simplementa, cuando el usuario acceda a la url que no tiene página generada, esta se generará en tiempo de ejecución.

## Redux Toolkit

En NextJS también es posible manejar el estado global de la aplicación con Redux Toolkit, solo que requiere un pequeño ajuste a lo que se acostumbra usar\
del lado del cliente con ReactJS. Uno de las diferencias es que se usa `useAppDispatch` en lugar de `useDispatch` y `useAppSelector` en lugar de `useSelector`.\
Para ello, primero se debe instalar las dependencias necesarias:

```bash
npm install @reduxjs/toolkit react-redux
```

Luego, se hace la implementación necesaria, la cual dejo en el siguiente ejemplo: [Redux Toolkit en NextJS](./ejemplo-redux-toolkit-nextjs.md)

## Creating API routes in Next.js

Next.js permite manejar API dentro de la misma aplicación, para ello solo necesitamos tener un archivo`route.ts`. El acceso al endpoit va a depender de la carpeta en que tenemos dicho archivo, ya que NextJS maneja las rutas basado en sus carpetas y en archivos de nombre `route.ts`. Por ejemplo, si tenemos un archivo `route.ts` en la carpeta `api`, entonces podremos acceder a dicho endpoint con la siguiente ruta: `http://localhost:3000/api/route`.

### Ejempo de endpoint GET `/pages/api/hello.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
    return new Response(
        JSON.stringfy({
            message: "Hello, World!",
        }),
        { status: 200 }
    );
}
```

A ese endpoint se puede acceder con la siguiente ruta [http://localhost:3000/api/hello](http://localhost:3000/api/hello).

Adicionalmente, podemos crear otros métodos HTTP como POST, PUT, DELETE, etc. Por ejemplo un POST seria de la siguiente forma:

```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    const data = await req.json();
    return NextResponse.json(
        {
            message: "Hello world!",
            data,
        },
        { status: 200 }
    );
}
```

También es posible obtener los datos enviados por URL o por el cuerpo de la petición, por ejemplo:

```ts
// /pages/api/products/[id]/page.ts
import { NextRequest, NextResponse } from "next/server";

interface Segments {
    params: {
        id: string;
    };
}
export async function GET(_: Request, segment: Segments) {
    const { id } = await segment.params;

    const product = await getProduct(id);

    return NextResponse.json({
        message: "Product found!",
        product,
    });
}
```

```ts
// /pages/api/products/page.ts

import prisma from "@/lib/prisma";
import * as yup from "yup";
import { NextRequest, NextResponse } from "next/server";

const postSchema = yup.object({
    description: yup.string().required(),
    completed: yup.boolean().optional().default(false), //! TODO: mostrar algo luego...
});
export async function POST(req: Request) {
    try {
        const data = await postSchema.validate(await req.json(), { strict: true });

        const todo = await prisma.todo.create({ data });

        return NextResponse.json(todo, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: `Error: ${error.message}`, error }, { status: 400 });
    }
}
```

## STATE MANAGEMENT

### Zustand:

Zustand is a small, fast and scaleable bearbones state-management solution using modern React hooks API to re-create the same power and flexibility of Redux. [Ir a la documentación](https://zustand.docs.pmnd.rs/getting-started/introduction)

#### How to use Zustand in NextJS:

1. Install Zustand:

```bash
npm install zustand
```

2. Create a store:

```ts
// /src/store/ui/ui-store.ts
import { create } from "zustand";

interface UIState {
    isSidebarMenuOpen: boolean;

    openSidebarMenu: () => void;
    closeSidebarMenu: () => void;
}

export const useUIState = create<UIState>((set) => ({
    isSidebarMenuOpen: false,

    openSidebarMenu: () => set(() => ({ isSidebarMenuOpen: true })),
    closeSidebarMenu: () => set(() => ({ isSidebarMenuOpen: false })),
}));
```

3. Use the store in a component:

```ts
// /src/components/Sidebar.tsx
"use client";

import { useUIState } from "@/store/ui/ui-store";

export default function Sidebar() {
    const isSidebarMenuOpen = useUIState((state) => state.isSidebarMenuOpen);
    const closeSidebarMenu = useUIState((state) => state.closeSidebarMenu);

    return (
        <aside className={`sidebar ${isSidebarMenuOpen ? "open" : ""}`}>
            <button onClick={openSidebarMenu}>Open</button>
            <button onClick={closeSidebarMenu}>Close</button>
        </aside>
    );
}
```

## Authentication (using Next-Auth)

The way we are going to handle authentication in a NextJS project is using Auth.js, which is a library that provides a simple way to handle authentication in a NextJS project. [Ir a la documentación](https://next-auth.js.org/)

So, in order to use Auth.js in a NextJS project, we need to follow the next steps:

1. Install the necessary dependencies (we are going to use the beta version (v15.0.0-beta.25) of Auth.js for example):

```bash
npm install next-auth@beta
```

2. Creating a secret key for the JWT token using the following command:

```bash
openssl rand -base64 32
```

3. Save the secret key from the previous step in the `.env.local` file:

```env
NEXTAUTH_SECRET=your_secret_key
```

4. Create a file called `auth.config.ts` in the src folder:

```ts
// /src/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "./lib/prisma";
import bcryptjs from "bcryptjs";

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/auth/login",
        newUser: "/auth/new-account",
    },
    callbacks: {
        // The methods jwt and session will allow us to set the user full information into the session

        async jwt({ token, user }) {
            if (user) {
                token.data = user;
            }
            return token;
        },
        async session({ session, token }) {
            // This give us an typing error, then we need to create a file called `nextauth.d.ts` (implemented below) in the root of the project
            // in order to get access to all the user properties we need
            session.user = token.data as any; // <-- This is the line that gives us the typing error, so need to keep `as any`
            return session;
        },
    },
    providers: [
        // This is used for google authentication (OAuth)
        {
            id: "google",
            name: "Google",
            type: "oauth",
            profile: (profile) => {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
        // This is used for custom email and password authentication
        Credentials({
            async authorize(credentials) {
                // 1. Validate the credentials (could be done with zod or any other library)
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    return null;
                }

                // 2. Find the user by email in the database
                const { email, password } = parsedCredentials.data;
                const user = await prisma.user.findUnique({
                    where: {
                        email: email.toLowerCase(),
                    },
                });

                if (!user) {
                    return null;
                }

                // 3. Check if the password is valid using bcryptjs
                const isValid = bcryptjs.compareSync(password, user.password);

                if (!isValid) {
                    return null;
                }

                // 4. If the credentials are valid, return the user without the password
                const { password: _, ...userWithoutPassword } = user;
                return userWithoutPassword;
            },
        }),
    ],
    // This secret is required by NextAuth to encrypt the JWT token
    secret: process.env.NEXTAUTH_SECRET,
};

/**
 * This is the auth functions that are going to be used in the pages to work with the authentication/session
 * - signIn: This function is used to sign in the user
 * - signOut: This function is used to sign out the user
 * - auth: This function is used to get the session of the user
 * - handlers: This object contains the endpoint (GET and POST) endpoints that are going to be used to validate the session by usgin cookies,
 *   it requires a file called "route.ts" in the "/app/api/auth/[...nextauth]" folder */
export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
```

5. Create the file `nextauth.d.ts` in the root of the project:

```ts
// /nextauth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            emailVerified: boolean;
            role: string;
            image?: string;
        } & DefaultSession["user"];
    }
}
```

6. Create the required file `/app/api/auth/[...nextauth]/route.ts`:

```ts
// /app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth.config";

// This is all we need to export in order to use the handlers in the client pages/components
export const { GET, POST } = handlers;
```

7. Create the action to sign in the user in `/src/actions/auth/login.ts` and the action to sign out the user in `/src/actions/auth/logout.ts`:
    > IMPORTANT: This structre gave me some issues, because even though login process was successful,
    > it throws an exception, and it's necessary to handle it and check if it is an AuthError,
    > if IS IS NOT, then throw it again, so it will redirect correctly (which is weird, but it is how documentation is).

#### login.ts:

```ts
// /src/actions/auth/login.ts

"use server"; //<-- This is used (important) to indicate that this file is going to be executed in the server

import { signIn } from "@/auth.config";
import { sleep } from "@/utils";
import { AuthError } from "next-auth";

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await sleep(2);

        //await signIn("credentials", formData); <-- This is one way, but we can use the following way to redirect to the dashboard
        await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirect: true,
            redirectTo: prevState || "/?auth=true",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        // if all goes well, need to throw the error, it will redirect to the dashboard
        // since "src/app/auth/layout.tsx" is handling the redirection when user is authenticated
        throw error;
    }
}
```

#### logout.ts:

```ts
"use server";

import { signOut } from "@/auth.config";

export const logout = async () => {
    await signOut({
        redirect: true,
        redirectTo: "/auth/login",
    });
};
```

8. Login page (server side) `/src/pages/auth/login/page.tsx` and LoginForm component (client side) `/src/pages/auth/login/ui/LoginForm.tsx`:

#### LoginPage.tsx

```ts
// /src/pages/auth/login/page.tsx
import { titleFont } from "@/config/fonts";
import { LoginForm } from "./ui/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen pt-32 sm:pt-52">
            <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

            <LoginForm />
        </div>
    );
}
```

#### LoginForm.tsx

```ts
"use client";
import Link from "next/link";
import React from "react";
//import { useFormState } from "react-dom"; // <-- This is not used any more, use useActionState instead
import { useActionState } from "react";

import { authenticate } from "@/actions";
import { IoInformationOutline } from "react-icons/io5";
import clsx from "clsx";

export const LoginForm = () => {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <form action={dispatch} className="flex flex-col">
            <label htmlFor="email">Correo electrónico</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                type="email"
                value="user1@gmail.com"
                name="email"
                onChange={() => {}}
            />

            <label htmlFor="email">Contraseña</label>
            <input
                className="px-5 py-2 border bg-gray-200 rounded mb-5"
                value="123456"
                type="password"
                name="password"
                onChange={() => {}}
            />

            {errorMessage && (
                <div className="flex h-8 items-end space-x-1 mb-2" aria-live="polite" aria-atomic="true">
                    <IoInformationOutline className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">Credenciales no son correctas</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className={clsx({ "btn-primary": !isPending, "btn-disabled": isPending })}
            >
                Ingresar
            </button>

            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link href="/auth/register" className="btn-secondary text-center">
                Crear una nueva cuenta
            </Link>
        </form>
    );
};
```

9. How to validate session after authentication, in order to redirect to the dashboard in `/src/app/auth/layout.tsx` (SERVER PAGE):

```ts
// /src/app/auth/layout.tsx
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();

    if (session?.user) {
        redirect("/");
    }

    return (
        <main className="flex justify-center">
            <div className="w-full sm:w-[350px] px-10">{children}</div>
        </main>
    );
}
```

10. How to validate session into a internal SERVER PAGE like `/src/pages/app/profile/page.tsx`:

```ts
// /app/profile/page.tsx
import { auth } from "@/auth.config"; // <-- Import the auth function
import { TitleComponent } from "@/components";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth(); // <-- Call the auth function

    if (!session?.user) {
        // <-- If the user is not authenticated, redirect to the login page
        redirect("/auth/login?returnTo=/profile");
    }

    // If the user is authenticated, show the profile page
    return (
        <div>
            <TitleComponent title="Profile" />
            <pre>{JSON.stringify(session.user, null, 2)}</pre>
        </div>
    );
}
```

11. How to validate and control the session in the client side, in order to avoid showing some components and parts of according to the user's session and roles:
    For this we need to use the `useSession` hook from `next-auth/react` (wthis is why we need the `/src/app/api/auth/[...nextauth]/route.ts` file created before):

```ts
// /src/components/sidebar/Sidebar.tsx

"use client";

import { useUIState } from "@/store";
import clsx from "clsx";
import Link from "next/link";
import React from "react";
import {
    IoCloseOutline,
    IoLogInOutline,
    IoLogOutOutline,
    IoPeopleOutline,
    IoPersonOutline,
    IoSearchOutline,
    IoShirtOutline,
    IoTicketOutline,
} from "react-icons/io5";
import { HSeparator } from "../hseparator/HSeparator";
import { logout } from "@/actions";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export const Sidebar = () => {
    // get query param:
    // This could be necessary to make a hard redirect to the home page when the user is authenticated
    // in order to update some client components that are not going to be updated after login
    // and session data is not being updated properly
    const searchParams = useSearchParams();
    if (searchParams.has("auth")) {
        window.location.replace("/");
    }

    const isSidebarMenuOpen = useUIState((state) => state.isSidebarMenuOpen);
    const closeSidebarMenu = useUIState((state) => state.closeSidebarMenu);

    const { data: session } = useSession();
    const user = session?.user;
    const isAuthenticated = !!user;
    const isAdmin = isAuthenticated && user?.role === "ADMIN";
    const isUser = isAuthenticated && user?.role === "USER";

    const handleCloseSidebarMenu = () => {
        closeSidebarMenu();
    };

    return (
        <div>
            {/* Background black */}
            {isSidebarMenuOpen && <div className="fade-in fixed top-0 left-0 w-screen h-screen z-10 bg-black/30"></div>}
            {/* Blur */}
            {isSidebarMenuOpen && (
                <div
                    onClick={handleCloseSidebarMenu}
                    className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
                ></div>
            )}
            {/* Sidemenu */}
            <nav
                className={clsx(
                    "fade-in fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                    {
                        "translate-x-full": !isSidebarMenuOpen,
                    }
                )}
            >
                <IoCloseOutline
                    className="absolute top-5 right-5 text-2xl cursor-pointer"
                    onClick={handleCloseSidebarMenu}
                />

                {/* Input */}
                <div className="relative mt-14">
                    <IoSearchOutline className="absolute top-2 left-2 text-xl text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar"
                        className="w-full bg-gray-50 rounded border-b-2 pl-10 pr-3 py-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Menú */}
                {isUser && (
                    <Link
                        href="/profile"
                        className="flex items-center mt-10 p-2 rounded transition-all hover:bg-gray-100"
                        onClick={handleCloseSidebarMenu}
                    >
                        <IoPersonOutline className="text-4xl text-gray-500 cursor-pointer" />
                        <span className="ml-5 text-lg">Perfil</span>
                    </Link>
                )}
                {isUser && (
                    <Link
                        href="/"
                        className="flex items-center mt-10 p-2 rounded transition-all hover:bg-gray-100"
                        onClick={handleCloseSidebarMenu}
                    >
                        <IoTicketOutline className="text-4xl text-gray-500 cursor-pointer" />
                        <span className="ml-5 text-lg">Órdenes</span>
                    </Link>
                )}

                {!isAuthenticated && (
                    <Link
                        href="/auth/login"
                        className="flex items-center mt-10 p-2 rounded transition-all hover:bg-gray-100"
                        onClick={handleCloseSidebarMenu}
                    >
                        <IoLogInOutline className="text-4xl text-gray-500 cursor-pointer" />
                        <span className="ml-5 text-lg">Ingresar</span>
                    </Link>
                )}

                {isAuthenticated && (
                    <button
                        className="flex w-full items-center mt-10 p-2 rounded transition-all hover:bg-gray-100"
                        onClick={() => {
                            handleCloseSidebarMenu();
                            logout();
                        }}
                    >
                        <IoLogOutOutline className="text-4xl text-gray-500 cursor-pointer" />
                        <span className="ml-5 text-lg">Salir</span>
                    </button>
                )}

                {/* Separator */}
                <HSeparator className="my-10" />

                {isAdmin && (
                    <Link
                        href="/"
                        className="flex items-center mt-10 p-2 rounded transition-all hover:bg-gray-100"
                        onClick={handleCloseSidebarMenu}
                    >
                        <IoShirtOutline className="text-4xl text-gray-500 cursor-pointer" />
                        <span className="ml-5 text-lg">Products</span>
                    </Link>
                )}

                {isAdmin && (
                    <Link
                        href="/"
                        className="flex items-center mt-10 p-2 rounded transition-all hover:bg-gray-100"
                        onClick={handleCloseSidebarMenu}
                    >
                        <IoTicketOutline className="text-4xl text-gray-500 cursor-pointer" />
                        <span className="ml-5 text-lg">Órdenes</span>
                    </Link>
                )}

                {isAdmin && (
                    <Link
                        href="/"
                        className="flex items-center mt-10 p-2 rounded transition-all hover:bg-gray-100"
                        onClick={handleCloseSidebarMenu}
                    >
                        <IoPeopleOutline className="text-4xl text-gray-500 cursor-pointer" />
                        <span className="ml-5 text-lg">Usuarios</span>
                    </Link>
                )}
            </nav>
        </div>
    );
};
```

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

## INTEGRACIÓN CON BASE DE DATOS I (Prisma)

NextJS nos permite interactuar con diferentes bases de datos, ya sea SQL o NoSQL, y hay diferentes ORM conocidos como son Prisma y TypeORM; en principio haremos la configuración con Prisma y PostgreSQL.

1. Para ello, se debe instalar la librería necesaria:

```bash
npm install @prisma/cli
```

2. Luego se debe iniciar el archivo de configuración de Prisma:

```bash
npx prisma init
```

3. Establecer la URL a la base de datos en el archivo `.env` usando la variable `DATABASE_URL`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

4. Establecer un provider en el archivo `schema.prisma` así como crear un modelo que representa a la tabla en la base de datos:

```ts
// /prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}


model Todo {
  id        String   @id @default(uuid())
  description String
  completed Boolean @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

5. En caso se tenga una base de datos existente, se puede generar el modelo de Prisma con el siguiente comando:

```bash
npx prisma db pull
```

6. Para sincronizar la base de datos con el modelo de Prisma, se debe ejecutar el siguiente comando:

```bash
npx prisma migrate dev --name init
```

Este comando crea una migración en la base de datos y la sincroniza con el modelo de Prisma.

> WARNING: Este comando elimina los datos de la base de datos.

7. Si se desea generar alteraciones a la base de datos sin generar migraciones y sin necesidad de purgar los datos, se puede ejecutar el siguiente comando:

```bash
npx prisma db push
```

8. Si se requiere hacer rollback a una migración anterior, se puede ejecutar el siguiente comando:

```bash
npx prisma migrate reset
```

Este comando elimina la última migración de la base de datos.

9. Luego, se debe ejecutar el comando para generar el cliente de Prisma:

```bash
npx prisma generate
```

Este comando genera y actualiza lo que se tiene en el archivo schema.prisma. y lo convierte en un cliente de Prisma que se puede usar en la aplicación. Tomar en cuenta que cada vez que se haga un cambio en el archivo schema.prisma, se debe ejecutar este comando para actualizar el cliente de Prisma y poder interactuar con la base de datos a nivel de código.

10. Para interactuar con la base de datos, se debe importar el cliente de Prisma en el archivo que se requiera:

```ts
// /pages/api/products/page.ts

import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    const todos = await prisma.todo.findMany();

    return NextResponse.json({
        message: "Todos found!",
        todos,
    });
}
```

> IMPORTANTE: Para revisar mayor información sobre Prisma, se puede acceder a la documentación oficial [aquí](https://www.prisma.io/docs/)

## INTEGRACIÓN CON BASE DE DATOS II (Prisma)

Run the following command to install the Prisma:

```bash
npm install prisma --save-dev
```

Then, run the following command to initialize the Prisma with npx:

```bash
npx prisma init --datasource-provider PostgreSQL
```

## Actualizaciones Optimistas

Ya que NextJS es un framework que usa ReactJS, es posible hacer actualizaciones optimistas en la aplicación, pero solo puede aplicarse del lado del cliente. Para ello se hace uso de un hook llamado `useOptimistic` y se maneja según el siguiente ejemplo:

```ts
// src/todos/components/TodoItem.tsx

"use client";
import { Todo } from "@prisma/client";
import { startTransition, useOptimistic } from "react"; // <-- Se importa el hook useOptimistic
import { IoCheckbox, IoSquareOutline } from "react-icons/io5";
import { ToggledTodo } from "../helpers";
import styles from "./TodoItem.module.css";

interface TodoProps {
    todo: Todo;
    toggleTodo: (id: string) => Promise<ToggledTodo | void>;
}

export const TodoItem = ({ todo, toggleTodo }: TodoProps) => {
    // optimisticTodo es el estado optimista del todo
    // toggleOptimisticTodo es la función que actualiza el estado optimista
    const [optimisticTodo, toggleOptimisticTodo] = useOptimistic(todo, (state) => ({
        ...state,
        completed: !state.completed,
    }));

    const onToggleTodo = async () => {
        // startTransition es una función de React que permite agrupar múltiples actualizaciones de estado en un solo render
        startTransition(() => {
            // toggleOptimisticTodo es una función que actualiza el estado optimista
            toggleOptimisticTodo(optimisticTodo);
        });

        // toggleTodo es una función que realiza la acción de toggle en el servidor
        await toggleTodo(optimisticTodo.id);
    };

    return (
        <div className={optimisticTodo.completed ? styles.todoDone : styles.todoPending}>
            <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
                <div
                    onClick={onToggleTodo}
                    className={`
                    flex p-2 rounded-md cursor-pointer
                    hover:bg-opacity-60
                    ${optimisticTodo.completed ? "bg-blue-100" : "bg-red-100"}
                `}
                >
                    {optimisticTodo.completed ? <IoCheckbox size={24} /> : <IoSquareOutline size={24} />}
                </div>

                <div className="text-center sm:text-left">{optimisticTodo.description}</div>
            </div>
        </div>
    );
};
```

## Cookies (Client side)

En NextJS es posible trabajar con cookies, tando del lado del cliente como del lado del servidor, pero en ambos casos la implementación y uso es diferente. A continuación se deja un ejemplo de cómo se trabaja del lado del cliente:

1. Primero instalamos la librería necesaria `cookies-next`:

```bash
npm install cookies-next
```

2. Se importa la librería en el archivo que se requiera (tiene que ser un client component):

```ts
// /src/components/TabBar.tsx

"use client";

import { setCookie } from "cookies-next"; // <-- Se importa la función setCookie
import { useState } from "react";

interface TabBarProps {
    currentTab?: number;
    tabOptions?: number[];
}

export const TabBar = ({
    tabOptions: tabs = [1, 2, 3, 4, 5],
    currentTab = 1, // <-- El servidor enviará el tab seleccionado que encuentra en la cookie, por este argumento.
}: TabBarProps) => {
    const [selected, setSelected] = useState(currentTab);

    const onTabSelected = (tab: number) => {
        setSelected(tab);
        // Aqui se setea la cookie con el tab seleccionado a nive de cliente
        setCookie("selectedTab", tab.toString());
    };

    return (
        <div className={`grid w-full space-x-2 rounded-xl bg-gray-200 p-2 ${"grid-cols-" + tabs.length}`}>
            {tabs.map((tab) => (
                <div key={tab}>
                    <input
                        type="radio"
                        id={`${tab}`}
                        checked={selected == tab}
                        onChange={() => {}}
                        className="peer hidden checked"
                    />
                    <label
                        onClick={() => onTabSelected(tab)}
                        className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white"
                    >
                        {tab}
                    </label>
                </div>
            ))}
        </div>
    );
};
```

## Cookies (Server side)

Del lado del servidor podemos obtener las cookies registradas a nivel cliente, ya que estas se envían en las cabeceras de las peticiones. Para ello, se puede hacer de la siguiente forma:

```ts
// /sec/app/dashboard/cookies/page.tsx

import { cookies } from "next/headers"; // <-- Se importa la función cookies
import { TabBar } from "@/components";

export const metadata = {
    title: "Cookies Page",
    description: "Cookies",
};

export default async function CookiesPage() {
    const cookieStore = await cookies(); // <-- Se obtienen las cookies del cliente
    const cookieTab = parseInt(cookieStore.get("selectedTab")?.value ?? "1", 10); // <-- Se obtiene el valor por el key

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col">
                <span className="text-3xl">Tabs</span>
                {/* Aquí se envía el tab seleccionado a la página que se genera en el servidor */}
                <TabBar currentTab={cookieTab} />
            </div>
        </div>
    );
}
```
