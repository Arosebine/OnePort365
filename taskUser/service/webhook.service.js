const axios = require('axios');
const subscriptions = [];

function subscribeWebhook(url) { 
  subscriptions.push(url);
}

function unsubscribeWebhook(url) {
  const index = subscriptions.indexOf(url);
  if (index !== -1) {
    subscriptions.splice(index, 1);
  }
}

function notifyWebhooks(data) {
  for (const url of subscriptions) {
    axios.post(url, data)
      .then(response => {
        console.log(`Webhook notification sent to ${url}: ${response.data}`);
      })
      .catch(error => {
        console.error(`Failed to send webhook notification to ${url}: ${error.message}`);
      });
  }
}

module.exports = {
  subscribeWebhook,
  unsubscribeWebhook,
  notifyWebhooks,
};
