# Utils info and commands to handle [NestJS](https://docs.nestjs.com/) projects

## Instaling NestJS

```PowerShell
npm i -g @nestjs/cli
```

### NestJS Help (`nest --help`)

| name          |    alias    |                                  description |
| ------------- | :---------: | -------------------------------------------: |
| application   | application |         Generate a new application workspace |
| class         |     cl      |                         Generate a new class |
| configuration |   config    |            Generate a CLI configuration file |
| controller    |     co      |            Generate a controller declaration |
| decorator     |      d      |                  Generate a custom decorator |
| filter        |      f      |                Generate a filter declaration |
| gateway       |     ga      |               Generate a gateway declaration |
| guard         |     gu      |                 Generate a guard declaration |
| interceptor   |     itc     |          Generate an interceptor declaration |
| interface     |     itf     |                        Generate an interface |
| library       |     lib     |     Generate a new library within a monorepo |
| middleware    |     mi      |            Generate a middleware declaration |
| module        |     mo      |                Generate a module declaration |
| pipe          |     pi      |                  Generate a pipe declaration |
| provider      |     pr      |              Generate a provider declaration |
| resolver      |      r      |      Generate a GraphQL resolver declaration |
| resource      |     res     |                 Generate a new CRUD resource |
| service       |      s      |               Generate a service declaration |
| sub           |     app     | Generate a new application within a monorepo |

---

## Creating a NestJS project

```bash
nest new my_project_name
```

## Include environment variables with **Configuration Module** from NestJS

1. Install `@nestjs/config`

```bash
yarn add @nestjs/config
```

2. Adding ConfigModule in AppModule, like:

```ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [],
    providers: [],
})
export class AppModule {}
```

3. Include a `.env` file in the project root, which must has a format like:

```env
PROVIDER_ID=provider_one
JWT_SECRET=your_secret_key
DB_NAME=this_is_the_bd_name
DB_USER=db_user
DB_PASSWORD=db_password111
```

4. Including ConfigModule in any module that requires environment variables:

```ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MyService } from "./my.service";

@Module({
    imports: [ConfigModule], // <--- HERE
    controllers: [],
    providers: [MyService],
})
export class MyModule {}
```

5. Injecting and using environment variables into service layer:

```ts
import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config"; // <-- Need this

@Injectable()
export class MyService {
    provider: string;

    constructor(
        @Inject(ConfigService) // <-- Need this
        private readonly configService: ConfigService // <-- Need this
    ) {
        this.provider = configService.get("PROVIDER_ID"); // <-- Use like this
    }
}
```
