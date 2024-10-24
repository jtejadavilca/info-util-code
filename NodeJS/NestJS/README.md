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
// app.module.ts
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
// my.module.ts
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
// my.service.ts
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

## Configuring MongoDB with ORM Mongoose:

1. Install `@nestjs/mongoose`:

```bash
yarn add @nestjs/mongoose
```

2. Adding MongooseModule in AppModule:

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://root:rootpassword@localhost:27017", {
            dbName: "bill_splitter",
        }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
    constructor() {
        //these two lines are optionals, just in case need db logs (with select, update, insert, etc)
        const mongoose = require("mongoose");
        mongoose.set("debug", true);
    }
}
```

3. Creating Schema class:

```ts
// product.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ collection: "products", timestamps: true })
export class ProductDocument {
    _id: string;

    @Prop()
    name: string;

    @Prop()
    description: number;

    @Prop()
    price: number;

    @Prop()
    enabled: boolean = true;

    @Prop()
    createdAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
```

4. Declaring schema class into the corresponding module:

```ts
//product.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductSchema } from "./infrastructure/out/database/schema/product.schema";

import { ProductService } from "./application/service/product.service";
import { ProductController } from "./infrastructure/in/controller/product.controller";

@Module({
    imports: [MongooseModule.forFeature([{ name: "Product", schema: ProductSchema }])],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
```

5. Implementing logic to handle data from DB:

```ts
// product.service.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"; // <-- Need this
import { Model } from "mongoose"; // <-- Need this
import { Types } from "mongoose"; // <-- Need this

import { ProductRepository } from "src/product/core/domain/repositories/product.repository";
import { ProductDocument } from "../database/schema/product.schema";

@Injectable()
export class ProductMongoRepository implements ProductRepository {
    constructor(
        @InjectModel("Product") // <-- Need this
        private productDbModel: Model<ProductDocument> // <-- Need this
    ) {}

    async create(newProduct: ProductModel): Promise<ProductModel> {
        const createdProduct = new this.productDbModel({ ...newProduct });
        return ProductDbMapper.toDomain(await createdProduct.save());
    }

    async update(id: string, updateProductModel: ProductModel): Promise<ProductModel> {
        const fieldsToUpdate = Object.keys(updateDto).reduce((acc, key) => {
            if (updateDto[key] !== undefined && updateDto[key] !== null) {
                acc[key] = updateDto[key];
            }
            return acc;
        }, {});

        const updatedProduct = await this.productDbModel.findByIdAndUpdate(id, fieldsToUpdate, {
            new: true,
        });

        return updatedProduct ? ProductDbMapper.toDomain(updatedProduct) : null;
    }

    async findAll(): Promise<ProductModel[]> {
        return (await this.productDbModel.find({ enabled: true })).map(ProductDbMapper.toDomain);
    }

    async findById(id: string): Promise<ProductModel> {
        const objectId = new Types.ObjectId(id);

        const productDocument = await this.productDbModel.findOne({
            _id: objectId,
            enabled: "true",
        });

        return productDocument ? ProductDbMapper.toDomain(productDocument) : null;
    }

    async physicalDelete(id: string): Promise<ProductModel> {
        const productDocument = await this.productDbModel.findByIdAndDelete(id);
        return productDocument ? ProductDbMapper.toDomain(productDocument) : null;
    }

    async delete(id: string): Promise<ProductModel> {
        const deletedProduct = await this.productDbModel.findByIdAndUpdate(id, { enabled: false }, { new: true });

        return deletedProduct ? ProductDbMapper.toDomain(deletedProduct) : null;
    }
}
```
