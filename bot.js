const TelegramBot = require('node-telegram-bot-api');

const token = '7955694028:AAEDg782HLJJGv-PHhVMg0zdknnC2YvNMGA';
const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет, октагон!");
});