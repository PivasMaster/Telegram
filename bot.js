const TelegramBot = require('node-telegram-bot-api');


const token = '7955694028:AAEDg782HLJJGv-PHhVMg0zdknnC2YvNMGA';
const bot = new TelegramBot(token, {polling: true});


const yourName = 'Черниговским Алекскеем';
const octagonSite = 'https://students.forus.ru/'; 

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет, октагон!");
});

bot.onText(/\/help/, (msg) => {
  const helpText = `Список команд:\n\n` +
    `/help -  Показать этот список команд\n` +
    `/site -  Ссылка на сайт Октагон\n` +
    `/creator -  Информация о создателе бота`;
  bot.sendMessage(msg.chat.id, helpText);
});

bot.onText(/\/site/, (msg) => {
  bot.sendMessage(msg.chat.id, octagonSite);
});

bot.onText(/\/creator/, (msg) => {
  bot.sendMessage(msg.chat.id, `Бот создан: ${yourName}`);
});