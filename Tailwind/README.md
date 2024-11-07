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
    content: ["./public/**/*.{html,js}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

> [!WARNING]  
> Tomar en cuenta que en la configuración anterior, la propiedad **content** (array) debe tener la ubicaión del HTML al que se le agregan los estilos de tailwind, y cuando se transpilen los estilos, se van a considerar solo los utilizados en dicho html. Por tanto, no se deben colocar los html en la carpeta src, ya que **content** no apunta a ese lugar. Además, los html deben hacer referencia a los CSS que están en `/public`y no en `/src`

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

> [!IMPORTANT]  
> Tener en cuenta que esta transpilación no es necesaria en proyectos con frameworks como _ReactJS_, _VueJS_, _Angular_, ya que estos se encargan de realizarlo automáticamente cuando tienen tailwind instalado.

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
