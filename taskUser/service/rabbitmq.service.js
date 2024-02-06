const amqp = require("amqplib");

const rabbitmqService = (message) => {
  return new Promise(async (resolve, reject) => {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue("task_queue");
            await channel.sendToQueue("task_queue", Buffer.from(JSON.stringify(message)));
            console.log(" The message has been Sent %s", message);
            resolve(message);
        } catch (error) {
            reject(error);
        }
    });
}


module.exports = { rabbitmqService };


