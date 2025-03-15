var express = require('express');
var dotenv = require('dotenv');
var router = express.Router();
var {OpenAI} = require('openai');
dotenv.config()

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async function(req, res) {
  let {mealSelect} = req.body;

  const prompt = "Generate a recipe for "+mealSelect+". I have crohn's disease. I am allergic to nuts. I do not like eggs.";

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {role: 'system', content: 'You are a helpful nutritionist generating recipes. Please output the name of the recipe, ingredients, and directions for a recipe that would fit the specifications in the request only. Do not include any leadup or explanatory text about the recipes. Ensuring allergies and dietary restrictions are adhered to is extremely important to you and the recipes.'},
        { role: 'user', content: prompt }
      ],
    });
    var generatedRecipe = response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating response');
  }

  console.log(generatedRecipe);
  res.render('generate');
});

/* GET recipe generator page. */
router.get('/', function(req, res) {
  res.render('generate');
});

module.exports = router;
