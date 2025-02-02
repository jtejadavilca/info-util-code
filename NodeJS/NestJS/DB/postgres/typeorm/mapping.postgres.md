# Mapping of entities in NestJS with Postgres

Examples of entity mapping in NestJS with Postgres

## Entity "Participant"

```ts
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { ParticipantType } from "./participant-type.entity";
import { User } from "./user.entity";

@Entity("participants") // Nombre de la tabla en la BD
export class Participant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "text", nullable: false })
    description: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    price: number;

    @ManyToOne(() => ParticipantType, (participantType) => participantType.participants, {
        nullable: false,
        eager: true,
    })
    @JoinColumn({ name: "participant_type_id" })
    participantType: ParticipantType;

    @ManyToOne(() => User, (user) => user.participants, { nullable: false, eager: true })
    @JoinColumn({ name: "created_by" })
    createdBy: User;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
```

## Entity "ParticipantType"

```ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Participant } from "./participant.entity";

@Entity("participant_types") // Nombre de la tabla en la BD
export class ParticipantType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "text", nullable: false })
    description: string;

    @OneToMany(() => Participant, (participant) => participant.participantType)
    participants: Participant[];
}
```

## Entity "User"

```ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Participant } from "./participant.entity";

@Entity("users") // Nombre de la tabla en la BD
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 255, nullable: false })
    name: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    email: string;

    @OneToMany(() => Participant, (participant) => participant.createdBy)
    participants: Participant[];
}
```
