import axios from 'axios';

// const qs = require('querystring');
import * as qs from 'qs'
import Router from 'express';


const clientId = 'b5462aa4785c447fb3b27f64d94d46e1';
const clientSecret = 'abbe117d21c5400d9839305b241299c7';

const router = new Router();


router.get('/get-fatsecret-token', async (req, res) => {
  try {
    const response = await axios.post(
      'https://oauth.fatsecret.com/connect/token',
      qs.stringify({
        grant_type: 'client_credentials',
        scope: 'basic',
      }),
      {
        auth: {
          username: clientId,
          password: clientSecret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.json(response.data); // { access_token, expires_in, token_type }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get token' });
  }
});

export default router;

