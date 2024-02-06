const webhookService = require('../service/webhook.service');


exports.subscribeWebhook= async (req, res) => {
  const { url, secretKey } = req.body;
  if (secretKey !== process.env.WEBHOOK_SECRET_KEY) {
    return res.status(401).json({ message: 'Invalid secret key' });
  }
  webhookService.subscribeWebhook(url);
  return res.status(200).json({ message: 'Webhook subscription successful' });
};

exports.unsubscribeWebhook=async (req, res) => {
  const { url, secretKey } = req.body;
   if (secretKey !== process.env.WEBHOOK_SECRET_KEY) {
    return res.status(401).json({ message: 'Invalid secret key' });
  }
  webhookService.unsubscribeWebhook(url);
  return res.status(200).json({ message: 'Webhook unsubscription successful' });
};

exports.webhookNotify=async (req, res) => {
  const { data, secretKey } = req.body;
   if (secretKey !== process.env.WEBHOOK_SECRET_KEY) {
    return res.status(401).json({ message: 'Invalid secret key' });
  }
  webhookService.notifyWebhooks(data);
  return res.status(200).json({ message: 'Webhook notification successful' });
};



