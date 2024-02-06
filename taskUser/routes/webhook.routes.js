const express = require('express');
const webhookController = require('../controllers/webhook.controller');
const router = express.Router();


router.post('/subscribe', webhookController.subscribeWebhook);
router.post('/notify', webhookController.webhookNotify);
router.post('/unsubscribe', webhookController.unsubscribeWebhook);

module.exports = router;
