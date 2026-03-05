import redis from "redis";

class RedisPubSubService {
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
        console.log("Redis Pub/Sub already connected");
        return;
    };
    await this.publisher.connect();
    await this.subscriber.connect();
    this.isConnected = true;
  }

  async publish(channel, message) {
    await this.connect();
    await this.publisher.publish(channel, message);
  }

  async subscribe(channel, callback) {
    await this.connect();
    await this.subscriber.subscribe(channel, (msg) => {
      callback(msg);
    });
  }
}

export default new RedisPubSubService();
