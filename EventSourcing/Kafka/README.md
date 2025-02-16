# Apache Kafka

Apache Kafka es una plataforma de streaming distribuida y de mensajería de código abierto diseñada para manejar grandes volúmenes de datos en tiempo real. Fue desarrollada originalmente por LinkedIn y luego donada a la Apache Software Foundation. Kafka es ampliamente utilizado en aplicaciones que requieren procesamiento de datos en tiempo real, integración de sistemas y manejo de grandes volúmenes de datos.

Apache Kafka is a distributed streaming platform that is used to build real-time streaming data pipelines and applications. Originaly created and implemented by LinkedIn, it was later open-sourced and donated to the Apache Software Foundation. Kafka is widely used in applications that require real-time data processing, system integration, and handling large volumes of data.

## Basics of Kafka

**a. Topic:** A topic is a stream of messages. Messages in a topic are stored in the order they arrive and are retained for a configurable period of time. Messages in a topic are divided into **partitions**, which are the units of parallelism in Kafka. Each partition is an immutable, ordered sequence of messages.

-   A topic is like a category or flow name of data in Kafka.
-   A topic can have multiple partitions.
-   Messages are published to a topic and there are consumers subscribed to the topic to consume the messages.
-   Example of a topic: `sell.orders` or `buy.orders`.

**b. Partition:** A partition is an ordered, immutable sequence of messages that is continually appended to a structured commit log. Each partition is replicated across a configurable number of brokers for fault tolerance.

-   A partition is a unit of parallelism in Kafka.
-   A topic is divided into multiple partitions to allow parallelisim and scalability.
-   Each partition is an ordered, immutable sequence of messages.
-   Message in a partition are ordered by an offset (possition in log).

**c. Broker:** A broker is a Kafka server that stores data and serves clients. A Kafka cluster is composed of multiple brokers.

-   A broker is a server in a Kafka cluster that stores data, manages topics and partitions.
-   A Kafka cluster is composed of multiple brokers, which guarantees fault tolerance and scalability.

**d. Producer:** A producer is an application that sends messages to a Kafka topic.

-   Example: A seller application that sends order messages to a `sell.orders` topic.

**e. Consumer:** A consumer is an application that reads messages from a Kafka topic.

-   Example: A buyer application that reads order messages from a `sell.orders` topic.

**f. Consumer Group:** A consumer group is a group of consumers that work together to consume messages from one or more topics. Each consumer in a group reads messages from a different partition.

## Main Features of Kafka

a. **High Scalability:** Kafka is designed to scale horizontally. It can handle large volumes of data and high throughput by adding more brokers to the cluster.

b. **Low Latency:** Kafka is designed to handle real-time data processing. It provides low latency message delivery, making it suitable for applications that require real-time data processing.

c. **Durability and Persistence:** Kafka provides durability and persistence by storing messages on disk. Messages are retained for a configurable period of time, even if consumers have already read them.

d. **Fault Tolerance:** Kafka is fault-tolerant. It replicates data across multiple brokers to ensure that messages are not lost in case of broker failures.

e. **Real-time Stream Processing:** Kafka supports real-time stream processing with the Kafka Streams API. It allows developers to build real-time streaming applications that process data in motion.

## Kafka Architecture

a. **Kafka Cluster:** A Kafka cluster is composed of multiple brokers that store data and serve clients. A Kafka cluster can have multiple topics, each divided into multiple partitions.

b. **ZooKeeper:** Kafka uses ZooKeeper for managing and coordinating the Kafka cluster. ZooKeeper is used for leader election, configuration management, and synchronization between brokers.

> [!IMPORTANT]  
> In recent versions of Kafka (KRaft mode), ZooKeeper is being deprecated and replaced by a self-managed metadata quorum.

c. **Data Streams:** Data streams are the flow of messages in Kafka. Messages are produced by producers and consumed by consumers. Data streams are divided into topics, which are divided into partitions.

## Common Use Cases of Kafka

a. **Real-time Data Processing:** Kafka is used for real-time data processing in applications such as fraud detection, monitoring, and analytics.

b. **System Integration:** Kafka is used for system integration in microservices architectures, where it acts as a message broker between services.

c. **Big Data Processing:** Kafka is used for big data processing in applications such as log aggregation, data ingestion, and data processing pipelines.

d. **Enterprise Messaging:** Kafka can be used as an enterprise messaging system for reliable message delivery between applications.

e. **Event Sourcing:** Kafka is used for event sourcing in applications that require storing and processing events as a source of truth.

## Simple example of Kafka

### Publish a message to a topic

```bash
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
props.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");

Producer<String, String> producer = new KafkaProducer<>(props);
producer.send(new ProducerRecord<>("mi-topico", "clave", "mensaje"));
producer.close();
```

### Consume messages from a topic

```bash
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "mi-grupo");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");

Consumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("mi-topico"));

while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(100));
    for (ConsumerRecord<String, String> record : records) {
        System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
    }
}
```

## Q&A

Some recopilation of Q&A about Kafka [Q&A Kafka](QA-Kafka.md).

## Summary

-   Kafka is a distributed streaming platform and messaging system designed to handle large volumes of data in real-time.
-   Offers high scalability, low latency, durability, fault tolerance, and real-time stream processing.
-   Kafka architecture consists of brokers, topics, partitions, producers, consumers, and consumer groups.
