const webhookService = require('../service/webhook.service');
const Webhook = require('../models/webhook.model');


exports.subscribeWebhook= async (req, res) => {
  const { url, secretKey } = req.body;
  if (secretKey !== process.env.WEBHOOK_SECRET_KEY) {
    return res.status(401).json({ message: 'Invalid secret key' });
  }
  const webhook = await Webhook.findOne({ url });
  if (webhook) {
    return res.status(400).json({ message: 'Webhook already exists' });
  }
  const newWebhook = await Webhook.create({ url });
  webhookService.subscribeWebhook(newWebhook);
  webhookService.notifyWebhooks({ event: "SUBSCRIPTION_CREATED", data: newWebhook });
  return res.status(200).json({ message: 'Webhook subscription successful', newWebhook });
};

exports.unsubscribeWebhook=async (req, res) => {
  const { url, secretKey } = req.body;
   if (secretKey !== process.env.WEBHOOK_SECRET_KEY) {
    return res.status(401).json({ message: 'Invalid secret key' });
  }
  const webhook = await Webhook.findOne({ url });
  if (!webhook) {
    return res.status(400).json({ message: 'Webhook does not exist' });
  }
  await Webhook.findByIdAndDelete(webhook._id);
  webhookService.unsubscribeWebhook(url);
  return res.status(200).json({ message: 'Webhook unsubscription successful' });
};

exports.webhookNotify=async (req, res) => {
  const { data, secretKey } = req.body;
   if (secretKey !== process.env.WEBHOOK_SECRET_KEY) {
    return res.status(401).json({ message: 'Invalid secret key' });
  }
  if (!data) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  webhookService.notifyWebhooks({ event: "task.created", data });
  return res.status(200).json({ message: 'Webhook notification successful' });
};



