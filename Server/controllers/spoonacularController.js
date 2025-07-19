import axios from 'axios';

export const analyzeIngredients = async (req, res, next) => {
  try {
    const { ingredients } = req.body;

    // const apiKey = process.env.SPOONACULAR_API_KEY;
    const apiKey = '9f6d7714643f476990ce843d9385a66f';

    const response = await axios.post(
      `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${apiKey}`,
      `ingredientList=${encodeURIComponent(ingredients)}&servings=1`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return res.json(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: 'Ошибка при обращении к Spoonacular API' });
  }
};
