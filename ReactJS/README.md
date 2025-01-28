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
@tailwind base;
@tailwind components;
@tailwind utilities;
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

### There are more examples of unit tests on this reactjs project:

-   https://github.com/jtejadavilca-cursos/journal-app-v2
-   https://github.com/jtejadavilca-cursos/calendar-project

# Installing Redux Toolkit and React-Redux:

Redux is a state management tool use in javascript applications. It helps to centralize and control the state of all our application. And Redux Toolkit is an excelent library whish allow us to implement Redux quite easier.

### npm:

```
npm install @reduxjs/toolkit react-redux
```

### yarn:

```
yarn add @reduxjs/toolkit react-redux
```

## Implementation

After we have Redux toolkit installed, we need to create some files like:

-   store.js
-   featureASlice.js
-   featureBSlice.js
-   thunks.js

> [!IMPORTANT] \
> Keep in mind that **slices** handle only sync process, if we need to handle async process, we need to use previously a **thunk**.

Example of `calendarSlice.js`:

```js
// Path: /store/calendar/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
export const authSlice = createSlice({
    name: "auth",
    initialState: {
        status: "checking", // "checking" | "authenticated" | "not-authenticated"
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
        errorMessage: null,
    },
    reducers: {
        login: (state, { payload }) => {
            state.status = "authenticated";
            state.uid = payload.uid;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL;
            state.errorMessage = null;
        },
        logout: (state, { payload }) => {
            state.status = "not-authenticated";
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoURL = null;
            state.errorMessage = payload?.errorMessage;
        },
        checkingCrendentials: (state) => {
            state.status = "checking";
        },
        wrongCredentials: (state, { payload }) => {
            state.status = "not-authenticated";
            state.errorMessage = payload;
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoURL = null;
        },
    },
});
export const { login, logout, checkingCrendentials, wrongCredentials } = authSlice.actions;
```

Example of `store.js`:

```js
// Path: /store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth/authSlice";
import { journalSlice } from "./journal/journalSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        journal: journalSlice.reducer,
    },
    /* Para cuando sea necesario desactivar la comprobación de serialización de Redux Toolkit
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
    */
});
```

When we need to handle async process, we need a **thunk** to do it, and this is going to interact with our slices:

```js
import {
    logoutFirebase,
    registerUserWithEmailPassword,
    signInWithEmailPassword,
    signInWithGoogle,
} from "../../firebase/providers";
import { clearNotesLogout } from "../journal/journalSlice";
import { checkingCrendentials, login, logout, wrongCredentials } from "./authSlice";

export const checkingAuthentication = () => {
    return async (dispatch) => {
        dispatch(checkingCrendentials());
    };
};

export const startGoogleAuthentication = () => {
    return async (dispatch) => {
        dispatch(checkingCrendentials()); // <- Here it calls slice

        const result = await signInWithGoogle();

        if (result.ok) {
            return dispatch(login(result)); // <- Here it calls slice
        }

        handlingWrongCredentials(dispatch, result.errorMessage);
    };
};

export const startCreatingUserWithEmailPassword = ({ email, password, displayName }) => {
    return async (dispatch) => {
        dispatch(checkingCrendentials());

        const { ok, errorMessage, uid, photoURL } = await registerUserWithEmailPassword(email, password, displayName);

        if (ok) {
            return dispatch(login({ uid, photoURL, displayName, email })); // <- Here it calls slice
        }

        handlingWrongCredentials(dispatch, errorMessage);
    };
};

export const startLoginWithEmailPassword = (email, password) => {
    return async (dispatch) => {
        dispatch(checkingCrendentials()); // <- Here it calls slice

        const result = await signInWithEmailPassword(email, password);

        if (result.ok) {
            return dispatch(login(result)); // <- Here it calls slice
        }

        handlingWrongCredentials(dispatch, "Invalid email or password");
    };
};

export const startLogout = () => {
    return async (dispatch) => {
        await logoutFirebase();
        dispatch(logout()); // <- Here it calls slice
        dispatch(clearNotesLogout()); // <- Here it calls slice
    };
};

const handlingWrongCredentials = (dispatch, errorMessage) => {
    dispatch(logout({ errorMessage })); // <- Here it calls slice
    dispatch(wrongCredentials(errorMessage)); // <- Here it calls slice

    setTimeout(() => {
        dispatch(wrongCredentials(null)); // <- Here it calls slice
    }, 5000);
};
```

## How to use is:

Example using a `LoginPage.jsx` component:

```js
// Path /auth/pages/LoginPage.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"; //! NEED THESE HOOKS

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Google } from "@mui/icons-material";
import { Alert, Button, Link, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

import { AuthLayout } from "../layout/AuthLayout";
import { useForm } from "../../hooks";
import { startGoogleAuthentication, startLoginWithEmailPassword } from "../../store/auth/thunks"; // Need this to import thunks methods directly

const formData = {
    email: "",
    password: "",
};

const formValidations = {
    email: [(value) => value.includes("@"), "Invalid email"],
    password: [(value) => value.length > 5, "Password must be at least 6 characters"],
};

export const LoginPage = () => {
    const dispatch = useDispatch(); // Need this to create a **dispatch**
    const { status, errorMessage } = useSelector((state) => state.auth); // Need this to obtain status attribute from a slice (which contains a specific state of a feature, like this auth example)
    const isAuthenticating = useMemo(() => status === "checking", [status]);
    const isAuthenticated = useMemo(() => status === "authenticated", [status]);
    const navigate = useNavigate();

    const { email, password, onInputChange, isFormValid, emailValid, passwordValid } = useForm(
        formData,
        formValidations
    );

    const [formSubmitted, setFormSubmitted] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated]);

    const onLogin = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        if (!isFormValid) return;
        dispatch(startLoginWithEmailPassword(email, password)); // Need this to "dispath" (execute) an async process (each one of these methods uses also the dispath to call slice methods internally)
    };

    const onGoogleLogin = (e) => {
        e.preventDefault();
        setFormSubmitted(true);
        dispatch(startGoogleAuthentication()); // Need this to "dispath" (execute) an async process (each one of these methods uses also the dispath to call slice methods internally)
    };

    return (
        <AuthLayout title="Login" maxWidth={468}>
            <form onSubmit={onLogin} className="animate__animated animate__fadeIn">
                <Grid container>
                    <Grid item="true" size={12} sx={{ mb: 2 }}>
                        <TextField
                            label="Email"
                            type="email"
                            placeholder="user@email.com"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={email}
                            onChange={onInputChange}
                            error={formSubmitted && !!emailValid}
                            helperText={emailValid}
                        />
                    </Grid>
                    <Grid item="true" size={12} sx={{ mb: 2 }}>
                        <TextField
                            label="Password"
                            type="password"
                            placeholder="Password"
                            variant="outlined"
                            fullWidth
                            name="password"
                            value={password}
                            onChange={onInputChange}
                            error={formSubmitted && !!passwordValid}
                            helperText={passwordValid}
                        />
                    </Grid>
                </Grid>

                {errorMessage && (
                    <Grid item="true" size={12} sx={{ mb: 2 }}>
                        <Alert severity="error">{errorMessage}</Alert>
                    </Grid>
                )}

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item="true" size={{ xs: 12, md: 6 }}>
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            onClick={onLogin}
                            disabled={isAuthenticating}
                        >
                            Login
                        </Button>
                    </Grid>
                    <Grid item="true" size={{ xs: 12, md: 6 }}>
                        <Button variant="contained" fullWidth onClick={onGoogleLogin} disabled={isAuthenticating}>
                            <Google />
                            <Typography sx={{ ml: 1 }}>Google</Typography>
                        </Button>
                    </Grid>
                </Grid>

                <Grid container direction="row" justifyContent="end">
                    <Grid item="true" size={6} sx={{ mt: 1 }}>
                        <Typography variant="body2" textAlign="right">
                            Don't have an account?{" "}
                            <Link component={RouterLink} color="inherit" to="/auth/register">
                                Register
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
        </AuthLayout>
    );
};
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
