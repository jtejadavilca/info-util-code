# NestJS + Kafka

In order to configure a Kafka producer into NestJS project, the following dependencies must be installed:

## 1. Necessary installations

```bash
npm npm i --save kafkajs @nestjs/microservices
```

## 2. Kafka Configurations

In order to configure the connection with Kafka, a `kafka.config.ts` file can be created, which will be automatically read in the `app.module.ts` file by just placing `imports: [KafkaModule.register(kafkaConfig)],`. This file must go in the root with the following structure:

```ts
import { KafkaOptions, Transport } from "@nestjs/microservices";

export const kafkaConfig: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            brokers: ["localhost:9092"],
        },
        consumer: {
            groupId: "my-kafka-consumer",
        },
    },
};
```
