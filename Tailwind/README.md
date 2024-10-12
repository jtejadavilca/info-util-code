# Utils info and commands to handle Taildwind framework in frontend projects

> [!IMPORTANT]  
> It is possible to include Tailwind into a NodeJS Project (any project that has `package.json`)

## Installation

#### yarn:

```
yarn add -D tailwindcss
```

#### npm:

```
npm install -D tailwindcss
```

## Configurar los path a los templates en el archivo `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

## Agregar las directivas al inicio del archivo css principal (e.g.: `main.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Para transpilar el css a un archivo final que contenga los estilos con tailwind se usa el siguiente comando:

```bash
npm tailwindcss -i ./src/main.css -o ./public/main.css --watch
```

### También se puede agregar el comando como script en el `package.json`:

```json
  "scripts": {
    "build-css": "tailwindcss -i ./src/main.css -o ./public/main.css",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

### Finalmente se referencia al archivo en el HTML (`'./public/index.html'`):

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="./main.css" rel="stylesheet" />
    </head>
    <body>
        <h1 class="text-3xl font-bold underline">Hello world!</h1>
    </body>
</html>
```
