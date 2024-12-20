const TelegramBot = require('node-telegram-bot-api');


const token = '7955694028:AAEDg782HLJJGv-PHhVMg0zdknnC2YvNMGA';
const bot = new TelegramBot(token, {polling: true});
const QRCode = require('qrcode');
const puppeteer = require('puppeteer');


const yourName = 'Черниговским Алекскеем';
const octagonSite = 'https://students.forus.ru/'; 

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Привет, октагон!");
});

bot.onText(/\/help/, (msg) => {
  const helpText = `Список команд:\n\n` +
    `/help -  Показать этот список команд\n` +
    `/site -  Ссылка clear сайт Октагон\n` +
    `/creator -  Информация о создателе бота\n` +
    '/randomItem - Вывести случайный  предмет\n'+
    '/deleteItem - Удалить предмет из БД\n'+
    '/getItemByID - Вернуть объект из БД';
  bot.sendMessage(msg.chat.id, helpText);
});

bot.onText(/\/site/, (msg) => {
  bot.sendMessage(msg.chat.id, octagonSite);
});

bot.onText(/\/creator/, (msg) => {
  bot.sendMessage(msg.chat.id, `Бот создан: ${yourName}`);
});

bot.onText(/\/randomItem/, async (msg) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM Items ORDER BY RAND() LIMIT 1');
    connection.end();
    if (rows.length > 0) {
      const item = rows[0];
      const response = `(${item.id}) - ${item.name}: ${item.desc}`;
      bot.sendMessage(msg.chat.id, response);
    } else {
      bot.sendMessage(msg.chat.id, 'В базе данных нет элементов.');
    }
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(msg.chat.id, 'Ошибка при получении случайного элемента.');
  }
});

bot.onText(/\/deleteItem (.+)/, async (msg, match) => {
  const itemId = match[1];
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('DELETE FROM Items WHERE id = ?', [itemId]);
    connection.end();
    if (result.affectedRows > 0) {
      bot.sendMessage(msg.chat.id, 'Удачно');
    } else {
      bot.sendMessage(msg.chat.id, 'Ошибка: Элемент не найден.');
    }
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(msg.chat.id, 'Ошибка при удалении элемента.');
  }
});
bot.onText(/\/getItemByID (.+)/, async (msg, match) => {
  const itemId = match[1];
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM Items WHERE id = ?', [itemId]);
    connection.end();
    if (rows.length > 0) {
      const item = rows[0];
      const response = `(${item.id}) - ${item.name}: ${item.desc}`;
      bot.sendMessage(msg.chat.id, response);
    } else {
      bot.sendMessage(msg.chat.id, 'Ошибка: Элемент не найден.');
    }
  } catch (error) {
    console.error('Error:', error);
    bot.sendMessage(msg.chat.id, 'Ошибка при получении элемента.');
  }
});

bot.onText(/!qr (.+)/, async (msg, match) => {
  const text = match[1];
  try {
      const qrCode = await QRCode.toDataURL(text);
      bot.sendPhoto(msg.chat.id, qrCode);
  } catch (error) {
      console.error('Error generating QR code:', error);
      bot.sendMessage(msg.chat.id, 'Ошибка при генерации QR-кода.');
  }
});
n
bot.onText(/!c (.+)/, async (msg, match) => {
    const url = match[1];
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const screenshot = await page.screenshot({ type: 'png' });
        await browser.close();
        bot.sendPhoto(msg.chat.id, { source: screenshot });
    } catch (error) {
        console.error('Error generating website screenshot:', error);
        bot.sendMessage(msg.chat.id, 'Ошибка при генерации скриншота.');
    }
});