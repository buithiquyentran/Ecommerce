import amqp from "amqplib";
const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    const notiQueue = "notificationQueue";
    const notificationExchange = "notificationEx"; // notification direct exchange
    const notificationExchangeDLX = "notificationExDLX"; // notification direct exchange
    const notificationRoutingKeyDLX = "notificationDLX";

    // 1. create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    //2. create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false,
      deadLetterExchange: notificationExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    //3. bind queue to exchange
    await channel.bindQueue(queueResult.queue, notificationExchange);

    //4. send message
    const message =
      "There is a new product in your shop!";
    channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: 10000,
    }); // set message expiration to 10 seconds
    console.log("::Producer", message);

    //close connection
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Error in producer:", error);
  }
};
runProducer();
