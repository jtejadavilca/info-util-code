# NestJS + Postgres + TypeORM

In NestJS it's possible to use different databases, including Postgres. For this, TypeORM can be used, an ORM that allows working with different databases, including Postgres.

Project example: [NestJS + Postgres + TypeORM](https://github.com/jtejadavilca/nestjs-registration-event-admin)

## 1. Necessary installations

In order to work with Postgres in NestJS, the following dependencies must be installed:

```bash
npm install @nestjs/typeorm typeorm pg
```

Other required libraries we need to install in order to have more configurations in our application are:

### For environment variables

```bash
npm install @nestjs/config
```

### For dto validation

```bash
npm install class-validator class-transformer
```

## 2. DB Configurations (Not mandatory)

In order to configure the connection with Postgres, a `ormconfig.json` file can be created, which will be automatically read in the `app.module.ts` file by just placing `imports: [TypeOrmModule.forRoot()],`. This file must go in the root with the following structure:

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

## 3. Adding TypeORM configuration to the application module

Para agregar la configuración de TypeORM al módulo de la aplicación, se debe importar el módulo `TypeOrmModule` en el módulo principal de la aplicación (`app.module.ts`) y configurarlo con la información del archivo `ormconfig.json`:

To add the TypeORM configuration to the application module, the `TypeOrmModule` module must be imported in the main application module (`app.module.ts`) and configured with the information from the `ormconfig.json` file:

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [
        //TypeOrmModule.forRoot(), <- This gets the configuration from ormconfig.json
        TypeOrmModule.forRoot({
            // <- This receives the configuration directly here
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

## 4. Adding specific entity/module configuration in its own module

To add the configuration of a specific entity/module, it must be imported in the module where it will be used, and the `TypeOrmModule.forFeature()` method must be used to configure the entity:

```ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ParticipantType } from "./participant-type.entity";
import { ParticipantTypeService } from "./participant-type.service";

@Module({
    imports: [TypeOrmModule.forFeature([ParticipantType])],
    providers: [ParticipantTypeService],
    exports: [
        ParticipantTypeService,
        {
            provide: ParticipantTypeRepository, // <- This is the repository (abstract class) that will be used
            useClass: ParticipantTypeMongoDbRepository, // <- This is the repository implementation that will be used
        },
    ],
})
export class ParticipantTypeModule {}
```

## 5. Ejemplos de mapeo de entidades en NestJS con Postgres

Se puede ver un ejemplo de mapeo de entidades en NestJS con Postgres en el siguiente enlace: [Ejemplos de mapeo de entidades en NestJS con Postgres](./mapping.postgres.md).

## 6. Example of controller, service and repository:

In the following link you can see an example of a controller, service and repository in NestJS with Postgres: [Example of controller, service and repository in NestJS with Postgres](./controller-service-repository.postgres.md).
