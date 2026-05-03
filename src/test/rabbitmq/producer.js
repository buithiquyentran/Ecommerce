import amqp from "amqplib";
const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const queueName = "test-topic";
    // Sender
    await channel.assertQueue(queueName, { durable: true });
    const message = "Hello, RabbitMQ!";
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log("Message Sent:", message);
  } catch (error) {
    console.error("Error in producer:", error);
  }
};
runProducer();
