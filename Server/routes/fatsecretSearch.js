import axios from 'axios';
import * as qs from 'qs';
import Router from 'express';

const router = new Router();

// Объект для хранения токена и времени его истечения
let fatSecretToken = {
  value: null,
  expiresAt: null
};

// Время жизни токена (1 час в миллисекундах)
const TOKEN_EXPIRATION_TIME = 36000 * 1000;


async function getAndStoreFatSecretToken() {
  try {
    const response = await axios.get('http://localhost:5000/api/fatsecret/auth/get-fatsecret-token');
    
    // Обновляем токен и время его истечения
    fatSecretToken = {
      value: response.data.access_token,
      expiresAt: Date.now() + TOKEN_EXPIRATION_TIME
    };
    
    console.log('Токен успешно получен и сохранён');
    return fatSecretToken.value;
  } catch (error) {
    console.error('Ошибка при получении токена:', error.message);
    throw error;
  }
}


async function getValidToken() {
  // Проверяем, есть ли токен и не истек ли его срок действия
  if (fatSecretToken.value && fatSecretToken.expiresAt > Date.now()) {
    console.log('Используется существующий токен');
    return fatSecretToken.value;
  }
  
  console.log('Получаем новый токен...');
  return await getAndStoreFatSecretToken();
}

router.get('/search', async (req, res) => {
  const { query } = req.query;

  try {
    // Получаем валидный токен
    const token = await getValidToken();

    const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
      params: {
        method: 'foods.search',
        format: 'json',
        search_expression: query,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Ошибка при запросе к FatSecret:', error.message);
    
    // Если ошибка авторизации (401), пробуем обновить токен и повторить запрос
    if (error.response?.status === 401) {
      try {
        console.log('Токен недействителен, пробуем обновить...');
        const newToken = await getAndStoreFatSecretToken();
        
        const newResponse = await axios.get('https://platform.fatsecret.com/rest/server.api', {
          params: {
            method: 'foods.search',
            format: 'json',
            search_expression: query,
          },
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
        
        return res.json(newResponse.data);
      } catch (retryError) {
        console.error('Ошибка при повторном запросе:', retryError.message);
        return res.status(500).json({ 
          error: 'Ошибка при запросе к FatSecret после обновления токена',
          details: retryError.message 
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Ошибка при запросе к FatSecret',
      details: error.message 
    });
  }
});

export default router;