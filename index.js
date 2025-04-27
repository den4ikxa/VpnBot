import TelegramBot from 'node-telegram-bot-api'
import { filterText } from './filterText.js'
import { updateUser } from './upDateUsers.js'
import { franc } from 'franc'
import { filterConfig } from './filtrConfig.js'
import path from 'path'
import fs from 'fs'
import FormDdata from 'form-data'
import e from 'express'
import { request } from 'http'

const token = ''
const bot = new TelegramBot(token,{polling:true})
const testUSer = {
    id: 32,
    ip: '10.7.0.3',
    name: ' Katya',
    dataStart: '15.01.2025',
    dataEnd: '2025-01-16',
    pay: null,
    contact: null,
    telegram: '1195659145'
  }



async function getUserIdByUsername(username) {
    const updates = await bot.getUpdates();
    console.log(updates)
    }
bot.on('callback_query', (msg) => {
    const callbackData = msg.data; // Получаем данные из callback
    const adminId = 1195659145; // ID администратора
    const chatId = msg.message.chat.id; // Правильный доступ к chat.id
  
    if (callbackData === 'action_1') {
      bot.sendMessage(chatId, 'Чтобы оплатить нужно перевезти 100р на номер 89258773279 и отправить скриншот чека в бота');
    
      // Обработчик для фото
      const onPhotoHandler = (msg) => {
        const photo = msg.photo;
        const largestPhoto = photo[photo.length - 1]; // Самое большое фото
        const fileId = largestPhoto.file_id;
  
        // Отправляем фото и chatId администратору
        bot.sendPhoto(adminId, fileId)
          .then(() => {
            bot.sendMessage(adminId, `ID отправителя: ${chatId}`);
            console.log('Фото отправлено администратору');
          })
          .catch((error) => {
            console.error('Ошибка при отправке фото администратору:', error);
          });
  
        // Убираем обработчик после выполнения
        bot.removeListener('photo', onPhotoHandler);
      };
  
      // Назначаем обработчик на одноразовый прием фото
      bot.on('photo', onPhotoHandler);
    }
    if (callbackData === 'ios') {
    const iosVideo = '/root/vpnbot/img/inst.MP4';
    
    if (fs.existsSync(iosVideo)) {  // Проверка существования файла
        const videoStream = fs.createReadStream(iosVideo);
        
    
        bot.sendVideo(chatId, videoStream, { caption: 'Установка VPN на iPhone' });
    } else {
        bot.sendMessage(chatId, 'Ошибка: Видео не найдено');
    }
}
    if (callbackData === 'android'){
        const iosVideo = '/root/vpnbot/img/android.mp4';
    
    if (fs.existsSync(iosVideo)) {  // Проверка существования файла
        const videoStream = fs.createReadStream(iosVideo);
        bot.sendVideo(chatId, videoStream, { caption: 'Установка VPN на Android' });
    } else {
        bot.sendMessage(chatId, 'Ошибка: Видео не найдено');
    }
        
    }

  });
  const usersList = async ()=>{
    const userList = await fetch('http://77.105.140.71:3000/bdusers')
    const data = await userList.json()
    return data
}
const SCRIPT_PATH = "/root/mainServ/generate_qr.sh";
bot.onText(/\/qrcode (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const clientName = match[1];

    // Используем шаблонную строку (``) и экранирование переменных
    exec(`${SCRIPT_PATH} ${clientName}`, (err, stdout, stderr) => {
        if (err || stderr) {
            bot.sendMessage(chatId, `Ошибка: ${stderr || err.message}`);
            return;
        }

        const qrPath = stdout.trim(); // Путь до PNG

        // Проверяем, существует ли файл
        if (!fs.existsSync(qrPath)) {
            bot.sendMessage(chatId, "QR-код не найден.");
            return;
        }

        bot.sendPhoto(chatId, fs.createReadStream(qrPath), { caption: `QR-код для ${clientName} `});
    });
});
bot.on('text', async (msg) => {
    const telegramId = msg.from.id.toString() // Используем msg.from.id
   
    if (msg.text === 'Узнать статус') {
        const users = await usersList();
    
        for (let user of users) {
            // Здесь мы используем msg.from.id вместо telegramId
            if (user.telegram === telegramId) {
                const formatDate = new Date(user.dataEnd).toLocaleDateString()
                if(user.cheakPay===null){
                    bot.sendMessage(msg.chat.id, `Статус:Активный Заканчивается: ${formatDate} ip${user.ip}`);
                    break;
                }
                else{
                    bot.sendMessage(msg.chat.id, `Статус:${user.cheakPay} Заканчивается: ${formatDate} ip${user.ip}`);
                    break;
                }
                
            }
        }
    }
    if(msg.text==='Узнать баланс'){

        const users = await usersList();    
    
        for (let user of users) {
            
            if (user.telegram ===telegramId) {
                bot.sendMessage(msg.chat.id, user.pay);
                break;
            }
        }
    }
    if(msg.text==='Оплата'){
        const adminId = 1195659145; // ID администратора
        bot.sendMessage(msg.chat.id, 'Чтобы оплатить нужно перевезти 100р на номер 89258773279(Тинкоф) и отправить скриншот чека в бота');
    
        // Обработчик для фото
        const onPhotoHandler = (msg) => {
          const photo = msg.photo;
          const largestPhoto = photo[photo.length - 1]; // Самое большое фото
          const fileId = largestPhoto.file_id;
    
          // Отправляем фото и chatId администратору
          bot.sendPhoto(adminId, fileId)
            .then(() => {
              bot.sendMessage(adminId, `ID отправителя: ${msg.chat.id}`);
              console.log('Фото отправлено администратору');
            })
            .catch((error) => {
              console.error('Ошибка при отправке фото администратору:', error);
            });
    
          // Убираем обработчик после выполнения
          bot.removeListener('photo', onPhotoHandler);
        };
    
        // Назначаем обработчик на одноразовый прием фото
        bot.on('photo', onPhotoHandler);
    }
   
});
function spamMoney(user){
    const today = new Date()
    
    const oldDate = new Date(user.dataEnd)
    const formatDate = new Date(user.dataEnd).toLocaleDateString()
    today.setDate(today.getDate()+3)
    const oldDateInMilliseconds = oldDate.getTime();
    const todayInMilliseconds = today.getTime();
    if (todayInMilliseconds >= oldDateInMilliseconds && user.telegram !== null&&user.cheakPay==='Активный') {
        try{
            bot.sendMessage(user.telegram,`Приветствую, VPN работает до ${formatDate}`,{
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: 'Оплатить',
                            callback_data: 'action_1'
                        }
                    ]]
                }
            })
        }
        catch(err){
            console.log('Такого юзера нет')
        }
    }
}
setInterval(()=>{
    fetch('http://77.105.140.71:3000/bdusers').then((respone)=>respone.json()).then((result)=>{
        result.forEach(element => {
            spamMoney(element)
        });
    })
},86400000)

bot.onText(/\/start/, async (msg) => {
    const telegramId = msg.chat.id.toString()
    const telegramUserName = msg.chat.username
    const chatId = msg.chat.id;
    const adminId = '1195659145'
    getUserIdByUsername()
    const oldUserList = await usersList()
    for(const user of oldUserList){
        if(user.telegram===telegramId){
            bot.sendMessage(chatId,'Привет'+' '+telegramUserName,{reply_markup:{
                keyboard:[['Узнать статус','Оплата','Узнать баланс']],resize_keyboard:true
            }})
            return
        }
    }
    
    bot.sendMessage(chatId,'Привет!',{
        reply_markup:{
            keyboard:[['Подключить'],],
            resize_keyboard:true,
            one_time_keyboard:true,
        }
    })

    // Объявляем textListener вне try/catch, чтобы избежать ошибки
});
let textListener;

bot.on('text',async (msg)=>{

        const telegramId = msg.chat.id.toString()
        const telegramUserName = msg.chat.username
        const chatId = msg.chat.id;
        const oldUserList = await usersList()
        if(msg.text==='Авторизоваться'){
            try {
                // Приветственное сообщение
                await bot.sendMessage(
                    chatId,
                    'Привет! Я помогу тебе привязать твою учетную запись к этому боту. Пожалуйста, напишите свое имя, IP-адрес, указанный в вашем приложении WireGuard, через пробел например:\nДенис 10.7.0.33'
                );
        
                // Отправляем инструкцию с изображением
                await bot.sendPhoto(chatId, './img/inst.jpg');

                // Создаем обработчик текстовых сообщений
                textListener = async (msg) => {
                    // Проверяем, чтобы сообщение пришло из текущего чата
                    if (msg.chat.id === chatId) {
                        const filter = filterText(msg.text); // Фильтруем текст
                        if (typeof filter === 'object') {
                            await bot.sendMessage(
                                chatId,
                                `Привет! Проверь данные, если все правильно нажми на кнопку:\nИмя: ${filter.name}\nIP: ${filter.ip}`,
                                {
                                    reply_markup: {
                                        inline_keyboard: [[
                                            {
                                                text: 'Все правильно',
                                                callback_data: 'action_2'
                                            }
                                        ]]
                                    }
                                }
                            );
        
                            // Обработка нажатия кнопки
                            bot.once('callback_query', async (callbackQuery) => {
                                if (callbackQuery.data === 'action_2') {
                                  (async () => {
                                    await fetch('http://77.105.140.71:3000/bdusers')
                                        .then((response) => response.json())
                                        .then((userArray) => updateUser(telegramId,telegramUserName,userArray,filter.ip));
                                })();
                                  // updateUser(telegramId,telegramUserName,userArray,filter.ip)
                                  // updateUser(telegramId,telegramUserName,newArray,filter.ip)
                                  
                                    await bot.sendMessage(
                                        chatId,
                                        'Спасибо за информацию. Теперь тебе будет приходить уведомление об оплате и другая информация.\nДля продолжение введи /start'
                                    );
                                    bot.removeListener('text', textListener); // Удаляем обработчик текстовых сообщений
                                }
                            });
                        } else {
                            // Если данные некорректны
                            await bot.sendMessage(chatId, filter);
                        }
                    }
                };
        
                // Добавляем обработчик текстовых сообщений
                bot.on('text', textListener);
            } catch (err) {
                console.error('Ошибка:', err);
            }
        }
        let isWaitingForConfigName = false;

// Обработчик команды "Подключить"
if (msg.text === 'Подключить' && !isWaitingForConfigName) {
    const adminId = 1195659145; // ID администратора
    const userId = msg.chat.id
    isWaitingForConfigName = true;
    
    bot.sendMessage(msg.chat.id,'Создание занимает до минуты')
    try {
        
        const nameConfig = Date.now()
        
        if (nameConfig && nameConfig !== 'Нужно ввести название конфига на английском') {
            await fetch('http://77.105.140.71:3000/add_client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: nameConfig })
            });
            
            bot.sendDocument(msg.chat.id, `/etc/wireguard/clients/${nameConfig}.conf`);
            bot.sendMessage(msg.chat.id, `Конфигурационный файл успешно создан. Для установки VPN вам потребуется следующее:

1. Скачайте приложение WireGuard из App Store (для iOS) или Google Play Market (для Android).
2. Скачать полученый конфиг на устройство.
3. Откройте приложение WireGuard.
4. Импортируйте созданный скаченый файл в приложение.
Если возниктут какие то вопросы можете написать тг @den4ikxa
Теперь вы готовы к использованию VPN-соединения. Для продалжение нажми /start`,{reply_markup:{
keyboard:[['Узнать статус','Оплата','Узнать баланс']],
resize_keyboard:true,}});
            bot.sendMessage(msg.chat.id,'Видео инструкция',{
                reply_markup: {
                    inline_keyboard: [[
                        {
                            text: 'IOS🍏',
                            callback_data: 'ios'
                        },
                        {
                            text:'Android🤖',
                            callback_data:'android'
                        }
                    ]]
                }
            })
            fetch('http://77.105.140.71:3000/get-file')
            bot.sendMessage(adminId,`Кто то подключился конфиг${adminId}+${msg.chat.username}+${userId}`)
            const userLs = await usersList()
            const lastUser = userLs[userLs.length - 1]
            updateUser(msg.chat.id,msg.chat.username,userLs,lastUser.ip)
        } else {
            bot.sendMessage(msg.chat.id, name); // Выводим сообщение об ошибке
        }
    } catch (error) {
        console.error(error);
        bot.sendMessage(msg.chat.id, 'Произошла ошибка при создании конфигурации.');
    } finally {
        isWaitingForConfigName = false; // Сбрасываем флаг после завершения обработки
    }
}
    })

// const sendMessage = setInterval(() => {
//   getUserBd()
// }, 86400000);
console.log('Бот запущен!');
