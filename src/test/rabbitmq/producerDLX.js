import amqp from "amqplib";
const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const notificationExchange = "notification-exchange"; // notification direct exchange


  } catch (error) {
    console.error("Error in producer:", error);
  }
};
runProducer();
