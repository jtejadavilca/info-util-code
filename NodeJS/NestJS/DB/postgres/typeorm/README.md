# NestJS + Postgres + TypeORM

En NestJS se pueden utilizar diferentes bases de datos, entre ellas Postgres. Para ello, se puede utilizar TypeORM, un ORM que permite trabajar con diferentes bases de datos, incluyendo Postgres.

## Instalaciones necesarias

Para trabajar con Postgres en NestJS, se deben instalar las siguientes dependencias:

```bash
$ npm install @nestjs/typeorm typeorm pg
```

## Configuración (No obligatoria)

Para configurar la conexión con Postgres, se puede crear un archivo `ormconfig.json`, el cual será leído automáticamente en el archivo `app.module.ts` con solo colocar `imports: [TypeOrmModule.forRoot()],`. Dicho archivo debe ir en la raíz con la siguiente estructura:

```json
{
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "postgres",
    "password": "password",
    "database": "test",
    "entities": ["dist/**/*.entity{.ts,.js}"],
    "synchronize": true
}
```

## Agregar la configuración de TypeORM al módulo de la aplicación

Para agregar la configuración de TypeORM al módulo de la aplicación, se debe importar el módulo `TypeOrmModule` en el módulo principal de la aplicación (`app.module.ts`) y configurarlo con la información del archivo `ormconfig.json`:

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "password",
            database: "test",
            entities: [__dirname + "/**/*.entity{.ts,.js}"],
            synchronize: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
```

## Ejemplos de mapeo de entidades en NestJS con Postgres

Se puede ver un ejemplo de mapeo de entidades en NestJS con Postgres en el siguiente enlace: [Ejemplos de mapeo de entidades en NestJS con Postgres](./mapping.postgres.md).
