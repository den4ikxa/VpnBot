import { franc } from 'franc'

export async function filterConfig(text) {
    const cyrillicPattern = /[а-яА-ЯёЁ]/; // Кириллические символы

    if (!text || text.trim() === '') {
        return 'Название конфигурации не может быть пустым'; // Проверка на пустую строку
    }

    if (cyrillicPattern.test(text)) {
        return 'Нужно ввести название конфига на английском'; // Текст содержит кириллицу
    }
    
    try {
        const response = await fetch('http://77.105.140.71:3000/bdusers');
        const users = await response.json();

        for (let element of users) {
            const nameCheak = element.name.trim();
            if (text === nameCheak) {
                return false; // Название уже занято
            }
        }
        
        return true; // Название свободно
    } catch (error) {
        console.error('Ошибка при проверке названия конфигурации:', error);
        return 'Ошибка подключения к серверу. Попробуйте позже.'; // Сообщение об ошибке
    }
}