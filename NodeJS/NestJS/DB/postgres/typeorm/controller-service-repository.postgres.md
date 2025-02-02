# Implementing Controller, Service and Repository in NestJS with TypeORM and PostgreSQL

In this example, we will implement a controller, service and repository in a NestJS application using TypeORM and PostgreSQL.

## 1. Creating the abstract repository

```ts
import { ParticipantType } from "../entities/participant-type.entity";

export abstract class ParticipantTypeRepository {
    abstract findAll(): Promise<ParticipantType[]>;

    abstract findOne(id: number): Promise<ParticipantType | null>;

    abstract create(participantType: Partial<ParticipantType>): Promise<ParticipantType>;

    abstract update(id: number, participantType: Partial<ParticipantType>): Promise<ParticipantType | null>;

    abstract delete(id: number): Promise<void>;
}
```

## 2. Creating the repository implementation

```ts
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ParticipantTypeRepository } from "../participant-type.repository";
import { ParticipantType } from "src/participant-type/entities/participant-type.entity";

@Injectable()
export class ParticipantTypeMongoDbRepository implements ParticipantTypeRepository {
    constructor(
        @InjectRepository(ParticipantType)
        private readonly repository: Repository<ParticipantType>
    ) {}

    async findAll(): Promise<ParticipantType[]> {
        return this.repository.find();
    }

    async findOne(id: number): Promise<ParticipantType | null> {
        return this.repository.findOne({ where: { id } });
    }

    async create(participantType: Partial<ParticipantType>): Promise<ParticipantType> {
        const newParticipantType = this.repository.create(participantType);
        return this.repository.save(newParticipantType);
    }

    async update(id: number, participantType: Partial<ParticipantType>): Promise<ParticipantType | null> {
        await this.repository.update(id, participantType);
        return this.repository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}
```

## 3. Creating the service

```ts
// src/participants/services/participant-type.service.ts
import { Injectable } from "@nestjs/common";
import { ParticipantType } from "./entities/participant-type.entity";
import { ParticipantTypeRepository } from "./repository/participant-type.repository";

@Injectable()
export class ParticipantTypeService {
    constructor(private readonly participantTypeRepository: ParticipantTypeRepository) {}

    async findAll(): Promise<ParticipantType[]> {
        return this.participantTypeRepository.findAll();
    }

    async findOne(id: number): Promise<ParticipantType | null> {
        return this.participantTypeRepository.findOne(id);
    }

    async create(participantType: Partial<ParticipantType>): Promise<ParticipantType> {
        return this.participantTypeRepository.create(participantType);
    }

    async update(id: number, participantType: Partial<ParticipantType>): Promise<ParticipantType | null> {
        return this.participantTypeRepository.update(id, participantType);
    }

    async delete(id: number): Promise<void> {
        return this.participantTypeRepository.delete(id);
    }
}
```

## 4. Creating the controller

```ts
import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { ParticipantTypeService } from "./participant-type.service";
import { CreateParticipantTypeDto } from "./dto/create-participant-type.dto";
import { UpdateParticipantTypeDto } from "./dto/update-participant-type.dto";

@Controller("participant-type")
export class ParticipantTypeController {
    constructor(private readonly participantTypeService: ParticipantTypeService) {}

    @Post()
    create(@Body() createParticipantTypeDto: CreateParticipantTypeDto) {
        return this.participantTypeService.create(createParticipantTypeDto);
    }

    @Get()
    findAll() {
        return this.participantTypeService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.participantTypeService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateParticipantTypeDto: UpdateParticipantTypeDto) {
        return this.participantTypeService.update(+id, updateParticipantTypeDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.participantTypeService.delete(+id);
    }
}
```
