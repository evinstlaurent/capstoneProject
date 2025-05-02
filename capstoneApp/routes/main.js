var express = require('express');
var router = express.Router();
var dotenv = require('dotenv');
var {OpenAI} = require('openai');
var {grabPreferences, grabRecipes, addRecipe} = require("./login")
var {getID} = require('../public/javascripts/id');
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async function(req, res) {
  let {mealSelect} = req.body;
  var select = await grabRecipes();
  try {
    preferences = await grabPreferences();
  } catch(error) {
    console.log(error);
  }
  console.log(select);

  // console.log(preferences);

  // const prompt = "Generate a recipe for "+mealSelect+". I have crohn's disease. I am allergic to nuts. I do not like eggs. Return the recipe in json using the following json output format: {recipeName: 'Recipe Name', recipeIngredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4', ...], recipeSteps: ['recipeStep1', 'recipeStep2', 'recipeStep3', ...]}";

  // try {
  //   const response = await client.chat.completions.create({
  //     model: 'gpt-4o',
  //     messages: [
  //       {role: 'system', content: 'You are a helpful nutritionist generating recipes. Please output the name of the recipe, ingredients, and directions for a recipe that would fit the specifications in the request for the specific meal type only. Do not include any leadup or explanatory text about the recipes. Ensuring allergies and dietary restrictions are adhered to is extremely important to you and the recipes.'},
  //       {role: 'user', content: prompt }
  //     ],
  //     response_format: {type: "json_object"},
  //   });
  //   var generatedRecipeOutput = response.choices[0].message.content;
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).send('Error generating response');
  // }

  // generatedRecipeOutput = JSON.parse(generatedRecipeOutput);

  // recipeName = generatedRecipeOutput.recipeName;
  // recipeIngredients = generatedRecipeOutput.recipeIngredients;
  // recipeSteps = generatedRecipeOutput.recipeSteps;

  // console.log(recipeName);
  // console.log(recipeIngredients);
  // console.log(recipeSteps);
  res.render('main');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if (getID() != null) {
    res.render('main');
  } else {
    res.redirect('/login')
  }
});

module.exports = router;
