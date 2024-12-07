# Steps to creacte a NextJS project from scratch

1. Create a new project using `npx create-next-app@latest`
2. Create a new folder into `src` folder called `config`
3. Create a new file into `config` folder called `fonts.ts`
4. Add the following code into `fonts.ts` file:

```ts
import { Inter } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
```

5. Import the `inter` font into layout.tsx file and use it like this:

```html
<body className="{inter.className}">
    {children}
</body>
```

6. Create folder `components` into `src` folder, this folder will contain reusable components for differents modules.
7. Start creating some folders like `cart`, `product`, `products` into folder `components` and they will contain its own components.
8. Create a new file into `components` folder called `index.ts` which is going to have all the exports of the components.:
9. Create a folder `interfaces` into `src` folder, this folder will contain all the interfaces of the project.
10. Create a folder `store` into `src` folder, this folder will contain the state management of the project (Like Zustand).
11. We will separate the design in two parts, the first one is for login and register and the second one is for the rest of the app. So we need create two folders into `src` folder called `auth` and `(shop)`.
12. We will handle two main paths `http://localhost:3000/auth` and `http://localhost:3000/` (notice that if we put a folder name into parentesis, it is not part of URL) so there shouldn't be a `page.tsx` file into `app` folder.
13. Create a new file into `auth` folder called `page.tsx`.
14. Create two new files into `(shop)` folder called `page.tsx` and `layout.tsx`.
    > Note: To create a layout component we could use the shortcut `lrc` and press key `tab`.
15. Create two new folders into `auth` folder called `login` and `register` and then two files called `page.tsx` in each folder.
16. The `(shop)` folder must have the following structure:

<!-- -   `(shop)`
    -   `layout.tsx`
    -   `page.tsx`
    -   `admin` folder
        -   `page.tsx`
    -   `cart` folder
        -   `page.tsx`
    -   `category` folder
        -   `[id]` folder
            -   `page.tsx`
    -   `checkout` folder
        -   `page.tsx`
        -   `address` folder
            -   `page.tsx`
    -   `empty` folder
        -   `page.tsx`
    -   `orders` folder
        -   `page.tsx`
        -   `[id]` folder
            -   `page.tsx`
    -   `product` folder
        -   `[slug]` folder
            -   `page.tsx`
    -   `products` folder
        -   `page.tsx` -->

```
shop
│   layout.tsx
│   page.tsx
│
├───admin
│       page.tsx
│
├───cart
│       page.tsx
│
├───category
│   └───[id]
│           page.tsx
│
├───checkout
│   │   page.tsx
│   │
│   └───address
│           page.tsx
│
├───empty
│       page.tsx
│
├───orders
│   │   page.tsx
│   │
│   └───[id]
│           page.tsx
│
├───product
│   └───[slug]
│           page.tsx
│
└───products
        page.tsx
```

17. Install react-icons with the command `npm install react-icons`
18. Install react-toastify with the command `npm install react-toastify`
