import amqp from "amqplib";
const runConsumer = async () => {
    try {
        const connection = await amqp.connect("amqp://localhost");

        const channel = await connection.createChannel();
        const queueName = "test-topic";

        await channel.assertQueue(queueName, { durable: true });

        // Listener
        channel.consume(queueName  , (msg) => {
          if (msg !== null) {
            console.log("Received:", msg.content.toString());
            channel.ack(msg);
          } else {
            console.log("Consumer cancelled by server");
          }
        });

        
    }catch (error) {
        console.error("Error in consumer:", error);
    }
};
runConsumer();