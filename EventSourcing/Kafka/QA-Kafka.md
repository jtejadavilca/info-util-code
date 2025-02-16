# Questions and Answers about Kafka

### > Si publico un evento a un topic, dicho evento es un objeto con una determinada estructura, pero este ha sido recientemente actualizado (antes tenia 5 propiedades, ahora tiene 4). En caso un consumidor obtiene dicho evento y este intenta usar la quinta propiedad que fue recientemente removida, entonces falla el proceso, en ese caso tengo algunas preguntas:

-   El error podría hacer caer el servidor de kafka?
-   kafka tiene reintentos automáticos para esos fallos?
-   en caso el servidor de kafka caiga, luego, al levantar nuevamente, procesa los eventos que se enviaron al topic cuando el servidor estaba down?

### Respuesta

#### 1. ¿El error podría hacer caer el servidor de Kafka?

**No**, el error no hará caer el servidor de Kafka. Kafka es un sistema distribuido altamente resiliente y está diseñado para manejar fallos en los consumidores o productores sin afectar el servidor en sí.

El error ocurre en el consumidor: Si un consumidor intenta deserializar un mensaje y falla debido a un cambio en la estructura del objeto (por ejemplo, intentar acceder a una propiedad que ya no existe), el error ocurrirá en el consumidor, no en el servidor de Kafka.

Kafka sigue funcionando: El servidor de Kafka seguirá operando normalmente, y otros consumidores y productores no se verán afectados.

#### 2. ¿Kafka tiene reintentos automáticos para esos fallos?

Kafka no maneja reintentos automáticos a nivel del servidor para errores de deserialización o procesamiento en los consumidores. Sin embargo, puedes implementar mecanismos de reintento en el lado del consumidor:

Reintentos en el consumidor:

Puedes usar un try-catch en el método del consumidor para capturar la excepción y reintentar el procesamiento del mensaje.

Spring Kafka proporciona mecanismos para manejar errores y reintentos, como SeekToCurrentErrorHandler o DefaultErrorHandler.

Ejemplo con Spring Kafka:

```java
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void consume(ConsumerRecord<String, MyEvent> record) {
        try {
            MyEvent event = record.value();
            // Procesar el evento
            System.out.println("Processing event: " + event);
        } catch (Exception e) {
            System.err.println("Error processing event: " + e.getMessage());
            // Reintentar o manejar el error
        }
    }
}
```

Configuración de reintentos en Spring Kafka:
Puedes configurar un RetryTemplate o un ErrorHandler para reintentar el procesamiento de mensajes fallidos.

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    @Bean
    public DefaultErrorHandler errorHandler() {
        // Reintentar 3 veces con un intervalo de 1 segundo
        return new DefaultErrorHandler(new FixedBackOff(1000L, 3L));
    }
}
```

#### 3. ¿En caso el servidor de Kafka caiga, luego, al levantar nuevamente, procesa los eventos que se enviaron al topic cuando el servidor estaba down?

Kafka está diseñado para ser altamente disponible y tolerante a fallos. Si el servidor de Kafka cae, aquí es lo que sucede:

Mensajes no perdidos:

Kafka almacena los mensajes en discos duraderos (logs de commit). Si el servidor se cae, los mensajes que ya fueron confirmados (committed) por el productor y almacenados en el log no se perderán.

Cuando el servidor de Kafka se reinicie, los mensajes que estaban en el log antes de la caída estarán disponibles para ser consumidos.

Mensajes no confirmados:

Si un productor intentó enviar un mensaje mientras Kafka estaba caído y no recibió confirmación (ack), el productor debe reintentar el envío una vez que Kafka esté disponible nuevamente.

Consumidores:

Los consumidores pueden continuar consumiendo mensajes desde el último offset confirmado una vez que Kafka esté de nuevo en línea.

Si el consumidor estaba en medio de procesar un mensaje cuando Kafka se cayó, deberá manejar la lógica para reprocesar ese mensaje (esto depende de la implementación del consumidor).

#### Recomendaciones Adicionales:

1. <u>Versionado de esquemas:</u> Usa un sistema de versionado para los mensajes (por ejemplo, Apache Avro con Schema Registry) para evitar problemas de compatibilidad entre productores y consumidores.

Esto permite que los consumidores manejen múltiples versiones de un mensaje.

2. <u>Manejo de errores robusto:</u> Implementa un mecanismo de dead-letter queue (DLQ) para mensajes que no pueden ser procesados después de varios reintentos.

3. <u>Monitoreo y alertas:</u> Configura monitoreo para detectar fallos en los consumidores o productores y alertar en caso de problemas.

4. <u>Pruebas de resistencia:</u> Realiza pruebas de resistencia (chaos testing) para asegurarte de que tu sistema pueda manejar caídas de Kafka y otros fallos.

#### Summary:

-   Kafka no se caerá debido a errores en los consumidores.
-   Los reintentos deben manejarse en el lado del consumidor.
-   Kafka no perderá mensajes confirmados, y los consumidores pueden continuar procesando mensajes desde donde lo dejaron una vez que el servidor esté de nuevo en línea.

<hr />

### > Qué es "Apache Avro con Schema Registry", un ejemplo en spring boot?

### Respuesta

-   Apache Avro: Es un formato de serialización de datos binario que incluye un esquema (estructura de datos) en el propio mensaje. Es eficiente en tamaño y velocidad.

-   Schema Registry: Es un servicio que almacena y gestiona versiones de esquemas Avro. Permite que productores y consumidores acuerden la estructura de los mensajes, evitando problemas de compatibilidad.

¿Cómo funciona?

1. El productor serializa el mensaje usando un esquema Avro y lo envía a Kafka.
2. El consumidor deserializa el mensaje usando el esquema correcto, obtenido del Schema Registry.
3. Si el esquema cambia, el Schema Registry garantiza que los consumidores puedan manejar versiones antiguas y nuevas.

Ejemplo en Spring Boot:

-   Dependencias en pom.xml

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
<dependency>
    <groupId>io.confluent</groupId>
    <artifactId>kafka-avro-serializer</artifactId>
    <version>7.0.1</version>
</dependency>
```

-   Configuración del Schema Registry en application.yml

```yml
spring:
    kafka:
        bootstrap-servers: localhost:9092
        producer:
            key-serializer: org.apache.kafka.common.serialization.StringSerializer
            value-serializer: io.confluent.kafka.serializers.KafkaAvroSerializer
        consumer:
            key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
            value-deserializer: io.confluent.kafka.serializers.KafkaAvroDeserializer
        properties:
            schema.registry.url: http://localhost:8081
```

-   Definición del esquema Avro (Crea un archivo `src/main/avro/MyEvent.avsc`):

```json
{
    "type": "record",
    "name": "MyEvent",
    "fields": [
        { "name": "id", "type": "int" },
        { "name": "name", "type": "string" }
    ]
}
```

-   Producer:

```java
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, MyEvent> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, MyEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessage(MyEvent event) {
        kafkaTemplate.send("my-topic", event);
    }
}
```

-   Consumer:

```java
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void consume(MyEvent event) {
        System.out.println("Received event: " + event);
    }
}
```

<hr />

### > ¿Qué es un mensaje confirmado en Kafka? ¿Hay más estados aparte de "confirmado"?

### Respuesta

Mensaje confirmado (Committed Message)

-   Confirmado (Committed): Un mensaje se considera confirmado cuando ha sido escrito en todos los réplicas del tópico y Kafka ha recibido la confirmación (ack) del líder de la partición.

-   Estados de un mensaje:

    -   Enviado (Sent): El productor ha enviado el mensaje al broker de Kafka.

    -   Escrito (Written): El mensaje ha sido escrito en el log del líder de la partición.

    -   Replicado (Replicated): El mensaje ha sido replicado en los réplicas de la partición.

    -   Confirmado (Committed): El líder ha confirmado que el mensaje está listo para ser consumido.

-   Configuración de confirmación (acks)
    1. acks=0: El productor no espera confirmación.
    2. acks=1: El productor espera confirmación del líder.
    3. acks=all: El productor espera confirmación de todos los réplicas.

<hr />

### > ¿Qué es un DLQ (Dead Letter Queue)? ¿Cómo implementarlo en Spring Boot?

### Respuesta

Un Dead Letter Queue (DLQ) es un tópico especial donde se envían mensajes que no pudieron ser procesados correctamente después de varios reintentos. Los mensajes en la DLQ pueden ser inspeccionados, analizados y reenviados para su procesamiento.

Implementación en Spring Boot:

-   Configuración del DLQ:

```java
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaConsumerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @KafkaListener(topics = "my-topic", groupId = "my-group")
    public void consume(ConsumerRecord<String, String> record) {
        try {
            // Procesar el mensaje
            System.out.println("Processing: " + record.value());
        } catch (Exception e) {
            // Enviar el mensaje fallido al DLQ
            kafkaTemplate.send("my-topic.DLQ", record.key(), record.value());
        }
    }
}
```

-   Configuración del DLQ en Spring Kafka

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.util.backoff.FixedBackOff;

@Configuration
public class KafkaConfig {

    @Bean
    public DefaultErrorHandler errorHandler(KafkaTemplate<String, String> kafkaTemplate) {
        return new DefaultErrorHandler((record, exception) -> {
            // Enviar al DLQ
            kafkaTemplate.send("my-topic.DLQ", record.key(), record.value());
        }, new FixedBackOff(1000L, 3L)); // Reintentar 3 veces
    }
}
```

<hr />

### > ¿Cómo puedo monitorear el estado del servidor de Kafka? ¿existe algún dashboard para eso? o debo entrar a través de la línea de comandos?

### Respuesta

Monitorear el estado del servidor de Kafka es fundamental para garantizar su correcto funcionamiento, especialmente en entornos de alta concurrencia y producción. Existen varias herramientas y métodos para monitorear Kafka, tanto a través de la línea de comandos como mediante dashboards visuales. A continuación, te explico las opciones más comunes:

1. Monitoreo mediante la línea de comandos
   Kafka proporciona scripts y herramientas integradas para monitorear el estado del clúster desde la terminal. Algunos comandos útiles son:

-   Ver el estado de los tópicos:

```bash
kafka-topics.sh --describe --zookeeper localhost:2181
```

-   Ver los consumidores y sus offsets:

```bash
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group my-group
```

-   Ver métricas del broker:
    Kafka expone métricas a través de JMX (Java Management Extensions). Puedes usar herramientas como `jconsole` o `jmxtrans` para acceder a ellas.

```bash
jconsole
```

2. Monitoreo mediante dashboards visuales:

    Existen varias herramientas que proporcionan dashboards visuales para monitorear Kafka de manera más intuitiva. Algunas de las más populares son:

    a. Confluent Control Center:

    - Es una herramienta oficial de Confluent (la empresa detrás de Kafka).
    - Proporciona un dashboard completo para monitorear tópicos, consumidores, brokers, y más.
    - Incluye alertas, análisis de rendimiento y gestión de esquemas.

    Cómo usarlo:

    1. Descarga Confluent Platform desde confluent.io.

    2. Inicia Confluent Control Center:

    ```bash
    confluent local services start
    ```

    3. Accede a `http://localhost:9021` en tu navegador.

    b. Kafka Manager (ahora llamado CMAK):

    - Es una herramienta de código abierto para gestionar y monitorear clústeres de Kafka.
    - Proporciona una interfaz web para ver el estado de los brokers, tópicos, consumidores y más.

    Cómo usarlo:

    1. Clona el repositorio de CMAK:

    ```bash
    git clone https://github.com/yahoo/CMAK.git
    ```

    2. Configura y ejecuta CMAK:

    ```bash
    cd CMAK
    ./sbt run
    ```

    3. Accede a `http://localhost:9000` en tu navegador.

    c. Kafka Monitor (desarrollado por LinkedIn):

    - Es una herramienta de código abierto para monitorear el rendimiento y la disponibilidad de Kafka.
    - Proporciona métricas en tiempo real y alertas.

    Cómo usarlo:

    1. Clona el repositorio:

    ```bash
    git clone https://github.com/linkedin/kafka-monitor.git
    ```

    2. Sigue las instrucciones del repositorio para configurar y ejecutar.

    d. Prometheus + Grafana:

    - Prometheus: Es un sistema de monitoreo y alertas que puede recolectar métricas de Kafka.
    - Grafana: Es una herramienta de visualización que se integra con Prometheus para crear dashboards personalizados.

    Cómo usarlo:

    1. Configura Prometheus para recolectar métricas de Kafka (usando un exporter como [Kafka Exporter](https://github.com/danielqsj/kafka_exporter)).
    2. Configura Grafana para visualizar las métricas.
    3. Crea dashboards en Grafana para monitorear el estado de Kafka.

        Ejemplo de métricas que puedes monitorear:

        - Tasa de mensajes producidos/consumidos.
        - Latencia de los consumidores.
        - Uso de disco y CPU de los brokers.

    e. Burrow (por LinkedIn):

    - Es una herramienta de monitoreo específica para consumidores de Kafka.
    - Proporciona métricas sobre el lag de los consumidores y su estado.

    Cómo usarlo:

    1. Descarga y configura Burrow desde su [repositorio oficial](https://github.com/linkedin/Burrow).
    2. Integra Burrow con Prometheus o Grafana para visualizar las métricas.

3. Métricas nativas de Kafka

    Kafka expone métricas a través de JMX (Java Management Extensions). Puedes acceder a estas métricas usando herramientas como:

    - **JConsole:** Herramienta gráfica incluida en el JDK.
    - **JMXTrans:** Para exportar métricas JMX a sistemas como Graphite o Prometheus.
    - **Kafka JMX Metrics:** Kafka expone métricas como:
        - `kafka.server: type=BrokerTopicMetrics,name=MessagesInPerSec`
        - `kafka.server: type=BrokerTopicMetrics,name=BytesInPerSec`
        - `kafka.consumer: type=ConsumerFetcherManager,name=MaxLag`

<hr />

### > ¿Cómo puedo reemplazar un microservicio consumidor de Kafka sin perder mensajes?

### Respuesta

Esta es una situación común cuando se realizan migraciones o actualizaciones de microservicios en un sistema que usa Kafka. Para evitar que ambos consumidores (el antiguo y el nuevo) procesen los mismos mensajes y envíen correos duplicados, puedes seguir una estrategia basada en grupos de consumidores (consumer groups) y offsets. Veámos el paso a paso:

1. **Entender los grupos de consumidores:**
   En Kafka, los grupos de consumidores permiten que múltiples consumidores trabajen juntos para consumir mensajes de un tópico. Cada grupo de consumidores mantiene su propio offset (posición de lectura) en el tópico.

-   Si dos consumidores pertenecen al mismo grupo, Kafka distribuirá las particiones del tópico entre ellos, y cada mensaje será procesado por un solo consumidor.

-   Si dos consumidores pertenecen a grupos diferentes, ambos consumirán todos los mensajes del tópico de manera independiente.

2. **Estrategia para evitar duplicados:**
   Para evitar que el nuevo y el antiguo consumidor procesen los mismos mensajes, puedes seguir estos pasos:

    a. Asignar un nuevo grupo de consumidores al nuevo microservicio

    - El antiguo consumidor seguirá usando su grupo de consumidores actual.
    - El nuevo consumidor usará un nuevo grupo de consumidores.

    Esto garantiza que ambos consumidores operen de manera independiente y no compartan offsets.

    b. Detener el antiguo consumidor de manera controlada

    Antes de desplegar el nuevo consumidor, asegúrate de que el antiguo consumidor haya procesado todos los mensajes pendientes y luego detén su ejecución. Esto evitará que ambos consumidores estén activos al mismo tiempo.

    c. Configurar el nuevo consumidor para comenzar desde el principio (opcional)

    Si deseas que el nuevo consumidor procese todos los mensajes desde el principio del tópico (por ejemplo, para reprocesar eventos históricos), puedes configurarlo para que comience desde el offset más antiguo (`earliest`). De lo contrario, comenzará desde el último offset confirmado.

3. **Implementación en Spring Boot**

    a. Configuración del nuevo consumidor

    En el nuevo microservicio, configura un **nuevo grupo de consumidores** en el archivo `application.yml`:

    ```yml
    spring:
        kafka:
            bootstrap-servers: localhost:9092
            consumer:
                group-id: nuevo-grupo-email # Nuevo grupo de consumidores
                auto-offset-reset: earliest # Opcional: comenzar desde el principio
    ```

    b. Código del nuevo consumidor

    ```java
    import org.springframework.kafka.annotation.KafkaListener;
    import org.springframework.stereotype.Service;

    @Service
    public class NuevoEmailConsumer {

        @KafkaListener(topics = "registro-usuarios", groupId = "nuevo-grupo-email")
        public void consume(String mensaje) {
            System.out.println("Nuevo consumidor: Enviando email - " + mensaje);
            // Lógica para enviar el email
        }
    }
    ```

    c. Detener el antiguo consumidor

    1. Detén el microservicio antiguo que contiene el consumidor obsoleto.

    2. Asegúrate de que no haya mensajes pendientes en el tópico para el grupo de consumidores antiguo. Puedes verificar esto con el siguiente comando:

    ```bash
    kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group antiguo-grupo-email

    # Si no hay lag (diferencia entre el último mensaje y el offset actual), puedes detener el consumidor de manera segura.
    ```

4. **Verificación y pruebas**

    - Prueba en un entorno de staging:

        - Despliega el nuevo consumidor y verifica que procese los mensajes correctamente.
        - Asegúrate de que el antiguo consumidor esté detenido y no procese mensajes.

    - Monitoreo:
        - Usa herramientas como **Kafka Manager**, **Confluent Control Center** o comandos de Kafka para monitorear los grupos de consumidores y los offsets.

5. **Eliminación del antiguo consumidor (opcional)**

    Una vez que el nuevo consumidor esté funcionando correctamente y hayas verificado que no hay duplicados, puedes:

    1. Eliminar el código del antiguo consumidor.
    2. Eliminar el grupo de consumidores antiguo (si ya no es necesario):
        ```bash
        kafka-consumer-groups.sh --bootstrap-server localhost:9092 --delete --group antiguo-grupo-email
        ```
    3. Limpiar cualquier recurso asociado al antiguo consumidor.

6. **Consideraciones adicionales**
    - **Manejo de errores:** Implementa un mecanismo de Dead Letter Queue (DLQ) en el nuevo consumidor para manejar mensajes fallidos.
    - **Pruebas de carga:** Asegúrate de que el nuevo consumidor pueda manejar el volumen de mensajes esperado.
    - **Monitoreo continuo:** Configura alertas para detectar problemas en el nuevo consumidor, como lag alto o errores de procesamiento.

#### Resumen

1. Usa un nuevo grupo de consumidores para el nuevo microservicio.
2. Detén el antiguo consumidor de manera controlada.
3. Configura el nuevo consumidor para comenzar desde el offset adecuado.
4. Verifica que no haya duplicados y que el nuevo consumidor funcione correctamente.
5. Elimina el antiguo consumidor una vez que la migración esté completa.

<hr />

### > ¿Cómo puedo manejar la transición de la pregunta anterior?

### Respuesta

Manejar la transición entre un consumidor antiguo y uno nuevo en un entorno donde los mensajes llegan continuamente puede ser un desafío. Sigamos los siguientes pasos para hacerlo de manera controlada, asegurándote de que no se pierdan mensajes y que el antiguo consumidor se detenga solo cuando ya no tenga mensajes pendientes por procesar.

1. Pausar el consumidor antiguo sin perder mensajes:

    Para pausar el consumidor antiguo sin perder mensajes, puedes usar las siguientes estrategias:

    - Pausar el consumidor a nivel de código:
      En Spring Kafka, puedes pausar y reanudar un consumidor programáticamente. Esto te permite detener temporalmente el procesamiento de mensajes sin perder el offset actual.

    ```java
    import org.apache.kafka.clients.consumer.Consumer;
    import org.apache.kafka.clients.consumer.ConsumerRecord;
    import org.springframework.kafka.annotation.KafkaListener;
    import org.springframework.kafka.listener.ConsumerAwareMessageListener;
    import org.springframework.kafka.listener.MessageListenerContainer;
    import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
    import org.springframework.stereotype.Service;
    import org.springframework.beans.factory.annotation.Autowired;

    @Service
    public class AntiguoEmailConsumer implements ConsumerAwareMessageListener<String, String> {

        @Autowired
        private MessageListenerContainer listenerContainer;

        private boolean pausado = false;

        @Override
        @KafkaListener(topics = "registro-usuarios", groupId = "antiguo-grupo-email")
        public void onMessage(ConsumerRecord<String, String> record, Consumer<?, ?> consumer) {
            if (pausado) {
                // No procesar mensajes si está pausado
                return;
            }

            // Procesar el mensaje
            System.out.println("Antiguo consumidor: Procesando - " + record.value());

            // Verificar si no hay más mensajes pendientes
            if (noHayMasMensajes(consumer)) {
                pausarConsumidor();
            }
        }

        private boolean noHayMasMensajes(Consumer<?, ?> consumer) {
            // Verificar si no hay más mensajes en las particiones asignadas
            return consumer.poll(java.time.Duration.ofMillis(100)).isEmpty();
        }

        private void pausarConsumidor() {
            pausado = true;
            ((ConcurrentMessageListenerContainer) listenerContainer).pause();
            System.out.println("Consumidor pausado. No se procesarán más mensajes.");
        }
    }
    ```

    - Pausar el consumidor a nivel de contenedor:
      Si no puedes modificar el código del consumidor antiguo, puedes pausar el consumidor desde Kafka usando el comando `kafka-consumer-groups.sh` para modificar los offsets.

        - Obtén el grupo de consumidores:

        ```bash
        kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list
        ```

        - Pausa el consumidor estableciendo el offset al final de cada partición:

        ```bash
        kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group antiguo-grupo-email --reset-offsets --to-latest --execute --topic registro-usuarios
        ```

        Esto evitará que el consumidor antiguo procese más mensajes.

2. Verificar cuándo no hay más mensajes pendientes:

    Para saber cuándo el consumidor antiguo ha procesado todos los mensajes pendientes, puedes:

    - Verificar el lag del consumidor: El **lag** es la diferencia entre el último mensaje en el tópico y el offset actual del consumidor. Si el lag es cero, significa que no hay mensajes pendientes.

        - Usa el siguiente comando para verificar el lag:

        ```bash
        kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group antiguo-grupo-email

        # Busca la columna LAG. Si es 0 para todas las particiones, el consumidor ha procesado todos los mensajes.
        ```

    - Monitorear el lag en tiempo real: Puedes usar herramientas como **Confluent Control Center**, **Kafka Manager** o **Prometheus + Grafana** para monitorear el lag en tiempo real.

3. Detener el consumidor antiguo de manera segura

    Una vez que hayas verificado que no hay más mensajes pendientes (lag = 0), puedes detener el consumidor antiguo de manera segura.

    - Detener el microservicio: Si el consumidor antiguo es parte de un microservicio, simplemente detén el servicio:

    ```bash
    sudo systemctl stop mi-microservicio-antiguo
    ```

    - Eliminar el grupo de consumidores (opcional): Si ya no necesitas el grupo de consumidores antiguo, puedes eliminarlo:

    ```bash
    kafka-consumer-groups.sh --bootstrap-server localhost:9092 --delete --group antiguo-grupo-email
    ```

4. Iniciar el nuevo consumidor

    Una vez que el consumidor antiguo esté detenido, inicia el nuevo microservicio con el nuevo grupo de consumidores. Asegúrate de que el nuevo consumidor esté configurado para comenzar desde el offset correcto (por ejemplo, **earliest** si deseas reprocesar mensajes).

5. Resumen de pasos

    1. Pausar el consumidor antiguo:
        - Usa `pause()` en **Spring Kafka** o modifica los offsets desde Kafka.
    2. Verificar el lag:
        - Usa `kafka-consumer-groups.sh` o herramientas de monitoreo para asegurarte de que no hay mensajes pendientes.
    3. Detener el consumidor antiguo:
        - Detén el microservicio y elimina el grupo de consumidores si es necesario.
    4. Iniciar el nuevo consumidor:
        - Asegúrate de que el nuevo consumidor esté configurado correctamente e inicia el nuevo microservicio con el nuevo grupo de consumidores.

6. Consideraciones adicionales

-   **Manejo de errores:** Asegúrate de que el nuevo consumidor tenga un mecanismo de reintentos y un DLQ para manejar mensajes fallidos.

-   **Pruebas en staging:** Realiza pruebas en un entorno de staging para asegurarte de que la transición sea suave.

-   **Monitoreo continuo:** Configura alertas para detectar problemas durante la transición.

<hr />

### > ¿Qué pasa si deseo que el nuevo consumido inicie donde el anterior se quedó y no como `earliest`?

### Respuesta

Si no deseas que el nuevo consumidor comience desde el principio (`earliest`), sino que continúe desde donde se quedó (es decir, desde el último offset confirmado), la configuración es más sencilla. Kafka maneja automáticamente los offsets para cada grupo de consumidores, por lo que el nuevo consumidor continuará desde el último offset confirmado por el grupo de consumidores antiguo, siempre y cuando ambos consumidores pertenezcan al **mismo grupo de consumidores**.

Sin embargo, en este caso, se está utilizando un **nuevo grupo de consumidores** para el nuevo microservicio. Por lo tanto, Kafka no tiene un historial de offsets para este nuevo grupo, y es necesario asegurar de que el nuevo consumidor comience desde el mismo punto en el que el antiguo consumidor se detuvo.

Veamos cómo lograr esto:

1. Configuración para continuar desde el último offset confirmado

    a. **Obtener el último offset confirmado del grupo antiguo:** Antes de detener el consumidor antiguo, obtén el último offset confirmado para cada partición del tópico. Puedes hacerlo usando el siguiente comando:

    ```bash
    kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group antiguo-grupo-email
    ```

    La salida mostrará algo como esto:

    ```plaintext
    GROUP           TOPIC              PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
    antiguo-grupo   registro-usuarios  0          100             150             50
    antiguo-grupo   registro-usuarios  1          200             250             50
    ```

    - `CURRENT-OFFSET`: Es el último offset confirmado por el consumidor antiguo.
    - `LOG-END-OFFSET`: Es el offset más reciente en la partición.
    - `LAG`: Es la diferencia entre el último offset (`CURRENT-OFFSET`) y el offset actual (`LOG-END-OFFSET`).

    Anota los valores de `CURRENT-OFFSET` para cada partición.

    b. **Configurar el nuevo consumidor para comenzar desde los offsets específicos:** En el nuevo microservicio, configura el consumidor para comenzar desde los offsets que obtuviste en el paso anterior. Esto se puede hacer de dos maneras:

2. **Opción 1: Usar `seek()` para asignar offsets manualmente**

    Puedes usar el método seek() en Spring Kafka para asignar manualmente los offsets desde los que el nuevo consumidor comenzará a leer.

    Ejemplo:

    ```java
    import org.apache.kafka.clients.consumer.Consumer;
    import org.apache.kafka.clients.consumer.ConsumerRecord;
    import org.apache.kafka.common.TopicPartition;
    import org.springframework.kafka.annotation.KafkaListener;
    import org.springframework.kafka.listener.ConsumerAwareMessageListener;
    import org.springframework.stereotype.Service;

    import java.util.Collections;

    @Service
    public class NuevoEmailConsumer implements ConsumerAwareMessageListener<String, String> {

        @Override
        @KafkaListener(topics = "registro-usuarios", groupId = "nuevo-grupo-email")
        public void onMessage(ConsumerRecord<String, String> record, Consumer<?, ?> consumer) {
            // Procesar el mensaje
            System.out.println("Nuevo consumidor: Procesando - " + record.value());
        }

        @Override
        public void onPartitionsAssigned(Consumer<?, ?> consumer) {
            // Asignar offsets manualmente cuando se asignan las particiones
            TopicPartition partition0 = new TopicPartition("registro-usuarios", 0);
            TopicPartition partition1 = new TopicPartition("registro-usuarios", 1);

            // Asignar los offsets obtenidos del grupo antiguo
            consumer.seek(partition0, 100);  // Offset para la partición 0
            consumer.seek(partition1, 200);  // Offset para la partición 1

            System.out.println("Offsets asignados manualmente.");
        }
    }
    ```

3.  - **Opción 2: Usar `auto.offset.reset` y sincronizar offsets**

    Si no deseas asignar offsets manualmente, puedes configurar el nuevo consumidor para que comience desde el último offset confirmado usando la propiedad auto.offset.reset y sincronizando los offsets entre los grupos.

    **Configuración en `application.yml`:**

    ```yml
    spring:
        kafka:
            bootstrap-servers: localhost:9092
            consumer:
                group-id: nuevo-grupo-email
                auto-offset-reset: latest # Comenzar desde el último offset confirmado
    ```

    **Sincronizar offsets entre grupos:**

    Para sincronizar los offsets entre el grupo antiguo y el nuevo grupo, puedes usar el comando `kafka-consumer-groups.sh` para copiar los offsets:

    1. Obtén los offsets del grupo antiguo:

    ```bash
    kafka-consumer-groups.sh --bootstrap-server localhost:9092 --describe --group antiguo-grupo-email
    ```

    2. Usa el comando `--reset-offsets` para asignar los mismos offsets al nuevo grupo:

    ```bash
    kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group nuevo-grupo-email --reset-offsets --to-offset 100 --execute --topic registro-usuarios:0

    kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group nuevo-grupo-email --reset-offsets --to-offset 200 --execute --topic registro-usuarios:1
    ```

    Esto asignará los mismos offsets al nuevo grupo de consumidores.

4. Resumen de la configuración:

    - **Opción 1:** Usar `seek()` -> Asigna offsets manualmente en el código del nuevo consumidor.
    - **Opción 2:** **Sincronizar offsets** -> Usa **kafka-consumer-groups.sh** para copiar los offsets del grupo antiguo.
    - **Opción 3: `auto.offset.reset=latest`** -> Configura el nuevo consumidor para comenzar desde el último offset confirmado.

5. Recomendaciones adicionales

-   **Pruebas en staging:** Realiza pruebas en un entorno de staging para asegurarte de que los offsets se asignan correctamente y no se pierden mensajes.
-   **Monitoreo:** Usa herramientas como Confluent Control Center o Kafka Manager para monitorear los offsets y el lag.
-   **Manejo de errores:** Implementa un mecanismo de reintentos y un DLQ en el nuevo consumidor para manejar mensajes fallidos.

<hr />

### > ¿Según la configuración anterior, en caso de usar `seek()`, qué pasa si se reinicia el microservicio, nuevamente iniciará desde el mismo offset configurado en el seek()?

### Respuesta

El comportamiento del `seek()` en Kafka depende de cómo se manejen los **offsets** y el **estado del consumidor**. Vamos a desglosar lo que sucede cuando reinicias el microservicio que usa seek():

1. ¿Qué hace `seek()`?

    El método seek() se utiliza para asignar manualmente el offset desde el cual un consumidor comenzará a leer mensajes en una partición específica. Este método solo afecta al consumidor actual y no modifica los offsets almacenados en Kafka para el grupo de consumidores.

2. Comportamiento al reiniciar el microservicio

    Cuando reinicias el microservicio, el consumidor se reinicia y se vuelve a unir al grupo de consumidores. En este caso, el comportamiento depende de dos factores:

    a. **¿Se han confirmado (committed) los offsets?**

    - Si los offsets se han confirmado (usando consumer.commitSync() o consumer.commitAsync()), Kafka recordará la última posición de lectura para el grupo de consumidores.
    - Si no se han confirmado los offsets, Kafka no tendrá registro de la última posición de lectura, y el consumidor comenzará desde el offset definido por la propiedad auto.offset.reset (por defecto, latest).

    b. **¿Se ejecuta `seek()` nuevamente después del reinicio?**

    - Si el código que ejecuta `seek()` se encuentra en el método `onPartitionsAssigned()` (como en el ejemplo anterior), este se ejecutará cada vez que el consumidor se reinicie y se le asignen particiones.
    - Si no se ejecuta `seek()` después del reinicio, el consumidor comenzará desde el último offset confirmado o desde el definido por `auto.offset.reset`.

3. ¿Qué sucede si uso `seek()` y reinicio el microservicio?

    Si usas seek() para asignar offsets manualmente y luego reinicias el microservicio, el comportamiento será el siguiente:

    1. Si no confirmas los offsets:

        - Al reiniciar, el consumidor no recordará los offsets asignados con seek().
        - El consumidor comenzará desde el offset definido por auto.offset.reset (por defecto, latest).
        - Esto puede causar que se pierdan mensajes o se procesen mensajes duplicados.

    2. Si confirmas los offsets después de usar `seek()`:

        - Al reiniciar, el consumidor recordará los offsets confirmados.
        - El consumidor comenzará desde el último offset confirmado, no desde el asignado con `seek()`.
        - Si deseas que el consumidor continúe desde el offset asignado con `seek()`, debes asegurarte de que `seek()` se ejecute nuevamente después del reinicio.

4. Solución: Ejecutar `seek()` después de cada reinicio

    Para garantizar que el consumidor siempre comience desde el offset asignado con seek(), incluso después de reiniciar el microservicio, puedes implementar lo siguiente:

    a. **Usar `onPartitionsAssigned()`:** Este método se ejecuta cada vez que se asignan particiones al consumidor, lo que incluye el inicio y reinicio del microservicio.

    Ejemplo:

    ```java
    import org.apache.kafka.clients.consumer.Consumer;
    import org.apache.kafka.clients.consumer.ConsumerRecord;
    import org.apache.kafka.common.TopicPartition;
    import org.springframework.kafka.annotation.KafkaListener;
    import org.springframework.kafka.listener.ConsumerAwareMessageListener;
    import org.springframework.stereotype.Service;

    import java.util.Collections;

    @Service
    public class NuevoEmailConsumer implements ConsumerAwareMessageListener<String, String> {

        @Override
        @KafkaListener(topics = "registro-usuarios", groupId = "nuevo-grupo-email")
        public void onMessage(ConsumerRecord<String, String> record, Consumer<?, ?> consumer) {
            // Procesar el mensaje
            System.out.println("Nuevo consumidor: Procesando - " + record.value());
        }

        @Override
        public void onPartitionsAssigned(Consumer<?, ?> consumer) {
            // Asignar offsets manualmente cuando se asignan las particiones
            TopicPartition partition0 = new TopicPartition("registro-usuarios", 0);
            TopicPartition partition1 = new TopicPartition("registro-usuarios", 1);

            // Asignar los offsets deseados
            consumer.seek(partition0, 100);  // Offset para la partición 0
            consumer.seek(partition1, 200);  // Offset para la partición 1

            System.out.println("Offsets asignados manualmente después del reinicio.");
        }
    }
    ```

    b. **Confirmar offsets después de procesar mensajes: ** Para evitar reprocesar mensajes, asegúrate de confirmar los offsets después de procesarlos:

    Ejemplo:

    ```java
    @Override
    public void onMessage(ConsumerRecord<String, String> record, Consumer<?, ?> consumer) {
        // Procesar el mensaje
        System.out.println("Nuevo consumidor: Procesando - " + record.value());

        // Confirmar el offset manualmente
        consumer.commitSync();
    }
    ```

5. Resumen del comportamiento

| Situación                                | Comportamiento                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| **Sin `seek()` y sin confirmar offsets** | El consumidor comienza desde `auto.offset.reset` (por defecto, `latest`).      |
| Con `seek()` y sin confirmar offsets     | El consumidor comienza desde `auto.offset.reset` después del reinicio.         |
| Con `seek()` y confirmando offsets       | El consumidor comienza desde el último offset confirmado después del reinicio. |
| Con `seek()` en `onPartitionsAssigned()` | El consumidor siempre comienza desde el offset asignado con `seek()`.          |

6. Recomendaciones adicionales

-   Usa `onPartitionsAssigned()`: Para garantizar que `seek()` se ejecute después de cada reinicio.
-   Confirma offsets: Para evitar reprocesar mensajes y garantizar que Kafka recuerde la última posición de lectura.
-   Pruebas en staging: Verifica el comportamiento en un entorno de pruebas antes de implementarlo en producción.
