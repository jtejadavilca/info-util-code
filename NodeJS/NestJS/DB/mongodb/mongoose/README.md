# NestJS + MongoDB + Mongoose

In this guide, we will see how to use MongoDB with Mongoose in a NestJS project.

## 1. Necessary installations

In order to work with MongoDB in NestJS, the following dependencies must be installed:

```bash
npm install @nestjs/mongoose mongoose
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

## 2. DB Configurations: Adding Mongoose configuration to the application module

```ts
// app.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        MongooseModule.forRoot("mongodb://root:rootpassword@localhost:27017", {
            dbName: "my_db_example",
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

## 3. Creating Schema class:

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

## 4. Declaring schema class into the corresponding module:

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

## It is recommendable to add these libraries (`class-validator` and `class-transformer`) to handle dates in request body:

1. Installing libreries:

```
yarn add class-validator class-transformer
```

2. Adding required configuration:

```ts
// main.ts

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true })); //<- This one
    app.setGlobalPrefix("api");
    await app.listen(3000);
}
bootstrap();
```

## Example of implementing database (mongo) mapping with relationships among entities:

This is an example of how to implement a relationship between two entities in a mongo database using three tables (documents).
Documents are: `User`, `Product`, and `Order`.

### User schema:

```ts
// user.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Product } from "./product.schema";
import { Types } from "mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: "users", timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: "Product" }] })
    products: Types.ObjectId[]; // References multiple products created by the user
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### Category schema:

```ts
// category.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Product } from "./product.schema";
import { Types } from "mongoose";

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ collection: "categories", timestamps: true })
export class Category {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: "Product" }] })
    products: Types.ObjectId[]; // References multiple products in the category
}

export const CategorySchema = SchemaFactory.createForClass(Category);
```

### Product schema:

```ts
// product.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Category } from "./category.schema";
import { User } from "./user.schema";
import { Types } from "mongoose";

export type ProductDocument = HydratedDocument<Product>;

@Schema({ collection: "products", timestamps: true })
export class Product {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop({ type: Types.ObjectId, ref: "Category", required: true })
    category: Types.ObjectId; // The category to which this product belongs

    @Prop({ type: Types.ObjectId, ref: "User", required: true })
    createdBy: Types.ObjectId; // The user who created this product
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

### Configuring module (DatabaseModule):

```ts
// database.module.ts

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Product, ProductSchema } from "./schemas/product.schema";
import { Category, CategorySchema } from "./schemas/category.schema";
import { User, UserSchema } from "./schemas/user.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Category.name, schema: CategorySchema },
            { name: User.name, schema: UserSchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
```

### Implementing service layer:

```ts
// product.service.ts

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Product, ProductDocument } from "./schemas/product.schema";

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

    async createProduct(
        name: string,
        description: string,
        price: number,
        categoryId: string,
        userId: string
    ): Promise<Product> {
        const product = new this.productModel({
            name,
            description,
            price,
            category: categoryId,
            createdBy: userId,
        });
        return product.save();
    }

    async getProducts(): Promise<Product[]> {
        return this.productModel
            .find()
            .populate("category") // Populate the category field
            .populate("createdBy") // Populate the user field
            .exec();
    }
}
```
