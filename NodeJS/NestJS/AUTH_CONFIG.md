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
