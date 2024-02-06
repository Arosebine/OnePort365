const amqp = require("amqplib/callback_api");
const task = require("../routes/taskReceived");

const receiveMessage = () => {
  amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue("task_queue", {
                durable: true
            });
            channel.prefetch(1);
            channel.consume("task_queue", function (msg) {
                if (msg!== null) {
                    const message = msg.content.toString();
                    task.performTask(message);
                    channel.ack(msg);
                }
            }, {
                noAck: false
            });
        });
    });
}



module.exports = { receiveMessage };