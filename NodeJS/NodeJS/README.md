# TODO API in NodeJS

# Steps:
1. Init the NodeJS proyect:
```
npm init -y
```


2. Start installing packages/libraries
    - Express
```
npm install express
```


3. Create ```index.js``` file into ```src``` folder

4. Start programming in index.js file. This is a simple example to start running the project:

```js
    const express = require('express');

    const app = express();
    const PORT = 3000;

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

```

5. Adding script int ```package.json``` file:
```
"dev": "nodemon src/index.js"
```

6. Run in terminal the following command:
```
npm run dev
```