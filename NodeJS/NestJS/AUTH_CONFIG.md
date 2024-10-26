# AUTHENTICATION AND AUTHORIZATION CONFIG

In order to have both authorization and configuration, we require some configuration in our nestjs project:

> [!IMPORTANT]
> If needed, there are two project I have as example using Authentication and Authorization:
>
> -   [bill_spliter_monorepo](https://github.com/jtejadavilca/bill_spliter_monorepo) This projects implements hexagonal architecture.
> -   [calendar-project](https://github.com/jtejadavilca-cursos/calendar-project)

## Authentication:

### Install necessary libraries:

```bash
yarn add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
yarn add -D @types/passport-jwt
```

### Creating a strategy

```ts
// /auth/strategy/jwt.strategy.ts

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "jsonwebtoken";

import { ConfigService } from "@nestjs/config";
import { Inject, UnauthorizedException } from "@nestjs/common";

import { AuthService } from "../service/auth.service";
import { UserDto } from "../dto/out/user.dto";

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(AuthService)
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get("JWT_SECRET"),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload): Promise<UserDto> {
        const { id } = payload;
        const user = await this.authService.getUserById(id);

        if (!user) {
            throw new UnauthorizedException("Token not valid");
        }

        return user;
    }
}
```

### Including `JwtModule` and `PassportModule` (indicating the strategy) into `auth.module.ts`:

```ts
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { JwtStrategy } from "./strategy/jwt.strategy";
import { UserSchema } from "./schema/user.schema";
import { UserRepository } from "./repository/user.repository";
import { AuthService } from "./service/auth.service";
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
        PassportModule.register({ defaultStrategy: "jwt" }),
        // Need this token configuration:
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: { expiresIn: "2h" },
            }),
        }),
        //---------------------------
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, UserRepository],
    exports: [JwtStrategy, PassportModule, JwtModule, MongooseModule],
})
export class AuthModule {}
```

### Implementing `AuthService` in service layer:

```ts
// auth/service/auth.controller.ts
import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../dto/in/create-user.dto";
import { UserRepository } from "../repository/user.repository";
import { UserDto } from "../dto/out/user.dto";
import { UserMapper } from "../dto/out/mapper/user.mapper";
import { LoginDto } from "../dto/in/login.dto";

@Injectable()
export class AuthService {
    constructor(
        @Inject(UserRepository)
        private readonly userRepository: UserRepository
    ) {}

    async signUp(createUserDto: CreateUserDto): Promise<UserDto> {
        const newUser = await this.userRepository.create({
            ...createUserDto,
            password: bcrypt.hashSync(createUserDto.password, 10),
        });
        return newUser ? UserMapper.toUserDto(newUser) : null;
    }

    async signIn(loginDto: LoginDto): Promise<UserDto> {
        const userDoc = await this.userRepository.findByEmail(loginDto.email);

        return userDoc && bcrypt.compareSync(loginDto.password, userDoc.password)
            ? UserMapper.toUserDto(userDoc)
            : null;
    }

    async getUserById(id: string): Promise<UserDto> {
        const userDoc = await this.userRepository.findById(id);
        return userDoc && userDoc.enabled ? UserMapper.toUserDto(userDoc) : null;
    }
}
```

### Finally, implementing `AuthController` in controller layer:

```ts
// auth/auth.controller.ts
import { Controller, Post, Body, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthService } from "./service/auth.service";
import { CreateUserDto } from "./dto/in/create-user.dto";
import { LoginDto } from "./dto/in/login.dto";
import { AuthResponse } from "./dto/out/auth.response";
import { UserDto } from "./dto/out/user.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

    @Post("signup")
    async signUp(@Body() createAuthDto: CreateUserDto): Promise<AuthResponse> {
        const user = await this.authService.signUp(createAuthDto);

        if (user) {
            return this.buildToken(user);
        }
        throw new UnauthorizedException("User not created");
    }

    @Post("login")
    async signIn(@Body() loginDto: LoginDto): Promise<AuthResponse> {
        const user = await this.authService.signIn(loginDto);
        if (user) {
            return this.buildToken(user);
        }
        throw new UnauthorizedException("Wrong credentials");
    }

    private buildToken(userDto: UserDto): AuthResponse {
        return new AuthResponse(userDto, this.jwtService.sign({ ...userDto }));
    }
}
```

> [!IMPORTANT]  
> At the end, don't forget to include `AuthModule` into `app.module.ts`

<hr />
<hr />

## Authorization:

> [!IMPORTANT] \
> In order to have authorization functionality (it needs to have Authentication configured before).

> [!NOTE] \
> It is possible to use directly some annotations in the controller methods like: \
> @UseGuards() from `@nestjs/common` and @AuthGuard() from `@nestjs/passport` \
> it is used like: `@UseGuards(@AuthGuard())` but it is better to encapsulate it \
> in a custom decorator as it is shown below.

### First, need to create some decorators:

1. **Auth** decorator (`auth.decorator.ts`): \
   This decorator allows us to use others decorators internally, then, it won't be necessary to add severals decorators on the controller methods, and instead will be only necessary to add `@Auth`. In this case, the decorator we are going to use are: `RoleProtected` and `UseGuard`

```ts
// Custom decorator
// /auth/decorators/auth.decorator.ts
import { applyDecorators, UseGuards } from "@nestjs/common";
import { ValidRoles } from "../interfaces";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "@nestjs/passport";
import { UseRoleGuard } from "../guards/use-role/use-role.guard";

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        RoleProtected(...roles), // This is another custom decorator which allow us to validate endpoints by roles (the implementation is few lines below)
        UseGuards(
            // Functions that receives Guards
            AuthGuard(), // This Guard (from @nestjs/passport library) uses the JwtStrategy to validate the token
            UseRoleGuard // This is one of custom Guards (the implementation is few lines below)
        )
    );
}
```

2. **RolProtected** decorator (`role-protected.decorator.ts`): \
   This decorator is used to set a list of roles into the request metadata and it will be used later in the UseRoleGuard to validate the logged in role user.

```ts
import { SetMetadata } from "@nestjs/common";
import { ValidRoles } from "../interfaces";

export const META_ROLES = "roles";

export const RoleProtected = (...args: ValidRoles[]) => {
    return SetMetadata(META_ROLES, args);
};
```

3. **GetUser** decorator (`get-user.decorator.ts`): \
   This decorator is going to be used to get the logged in user as parameter in controller methods. **NOTE:** It is necessary to use the `@Auth()` decorator too, otherwise, user is going to be `undefined`

```ts
// Custom decorator
// /auth/decorators/get-user.decorator.ts
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
        throw new InternalServerErrorException("User not found in the request");
    }

    // if 'data' is email or id or another user field,
    // it means we only require that field, otherwise, we need the whole user.
    return data ? user[data] : user;
});
```

4. **RawHeaders** decorator (`raw-headers.decorator.ts`): \
   The use of this decorator is optional, only if we need to get the headers sent by client (for example to get a custom haeder). To use this decorator should be included in the controller methods as a parámeter, like: `getData(@RawHeaders() headers) {}`

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RawHeaders = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.rawHeaders;
    return headers;
});
```

### Now we need a custom guard

1. **UseRoleGuard** (`use-role.guard.ts`): \
   This custom guard is going to validate that the logged in user has the role sent as parameter.

```ts
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { META_ROLES } from "src/auth/decorators/role-protected.decorator";

@Injectable()
export class UseRoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Here we get the roles settled in @RoleProtected decorator
        const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, context.getHandler());

        // If none roles were sent, then nothing is validated
        if (!validRoles || validRoles.length === 0) {
            return true;
        }

        // If we don't use @Auth() decorator, this request won't contain the logged in user
        const request = context.switchToHttp().getRequest();
        const { user } = request;

        if (!user) {
            throw new BadRequestException("User not found");
        }

        const { roles } = user;

        if (!roles.some((role: string) => validRoles.includes(role))) {
            throw new ForbiddenException(`User ${user.fullName} need a valid role: [${validRoles}]`);
        }

        return true;
    }
}
```

### Finally we can use the decorators this way:

-   Example 1:

```ts
// This is a controller method that uses @Auth() and @GetUser
// @Auth() doesn't have specified roles
// @GetUser() doesn't have specified field, then it returns the whole logged in user.
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user,
  ) {
    return this.authService.checkAuthStatus(user);
  }
```

-   Example 2:

```ts
// This is a controller method that uses only @Auth() and it has only one role allowed (ValidRoles.admin)
// @Auth() has one specified role: ValidRoles.admin
  @Get('private3')
  @Auth(ValidRoles.admin)
  getPrivate3(
  ) {

    return {
      ok: true,
      message: 'This is a private route',
    };
  }
```

-   Example 3:

```ts
// This is a controller method that uses @Auth(), @GetUser() and @RawHeaders()
// @Auth() has only ValidRoles.admin role allowed
// @GetUser() has specified just email field, which is going to be returned and passed as parameter.
// @RawHeaders() gets all the request headers as an array of strings with all the sent headers by client
  @Get('private')
  @Auth(ValidRoles.admin)
  getPrivate(
    @GetUser('email') userEmail,
    @RawHeaders() headers,
  ) {

    return {
      ok: true,
      message: 'This is a private route',
      headers
    };
  }
```

### After all the authorization config, we need to **import** AuthModule in every module we want to use the authorization control

-   Example:

```ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductSchema } from "./schema/product.schema";

import { ProductService } from "./service/product.service";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./repository/product.repository";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeature([{ name: "Product", schema: ProductSchema }]),
        AuthModule, // <- Imported here
    ],
    controllers: [ProductController],
    providers: [ProductRepository, ProductService],
})
export class ProductModule {}
```
