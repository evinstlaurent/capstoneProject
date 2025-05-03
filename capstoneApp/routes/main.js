var express = require('express');
var router = express.Router();
var dotenv = require('dotenv');
var {OpenAI} = require('openai');
var {grabPreferences, grabAllergies, grabDislikes, grabRecipes, addRecipe} = require("./login")
var {getID} = require('../public/javascripts/id');
dotenv.config();

var recipesArray = [];
var prevRecipesNameArray = [];

populateArray();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/', async function(req, res) {
  let {mealSelect} = req.body;
  try {
    var dislikes = await grabDislikes();
    var preferences = await grabPreferences();
    var allergies = await grabAllergies();
  } catch(error) {
    console.log(error);
  }

  let prompt = "Generate a recipe for "+mealSelect+".";

  if (preferences != null) {
    prompt = prompt+" I have the following dietary restrictions: "+preferences+".";
  }
  if (allergies != null) {
    prompt = prompt+" I am allergic to the following: "+allergies+".";
  }
  if (preferences != null) {
    prompt = prompt+" I dislike the following foods: "+dislikes+".";
  }

  prompt = prompt+" Return the recipe in json using the following json output format: {recipeName: 'Recipe Name', recipeIngredients: ['ingredient1', 'ingredient2', 'ingredient3', 'ingredient4', ...], recipeSteps: ['recipeStep1', 'recipeStep2', 'recipeStep3', ...]}";

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {role: 'system', content: 'You are a helpful nutritionist generating recipes. Please output the name of the recipe, ingredients, and directions for a recipe that would fit the specifications in the request for the specific meal type only. Do not include any leadup or explanatory text about the recipes. Ensuring allergies and dietary restrictions are adhered to is extremely important to you and the recipes. Do not generate recipes you have generated before. Please do not generate the following recipes: '+prevRecipesNameArray},
        {role: 'user', content: prompt }
      ],
      response_format: {type: "json_object"},
    });
    var generatedRecipeOutput = response.choices[0].message.content;
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating response');
  }

  generatedRecipeOutput = JSON.parse(generatedRecipeOutput);

  recipeName = generatedRecipeOutput.recipeName;
  recipeIngredients = generatedRecipeOutput.recipeIngredients;
  recipeSteps = generatedRecipeOutput.recipeSteps;

  try {
    await addRecipe(recipeName, recipeIngredients, recipeSteps);
    await populateArray()
  } catch(error) {
    console.log(error)
  }
  res.render('main', {recipesArray});
});

/* GET home page. */
router.get('/', async function(req, res, next) {
  if (getID() != null) {
    await populateArray();
    res.render('main', {recipesArray});
  } else {
    res.redirect('/login')
  }
});

module.exports = router;

async function populateArray() {
  try {
      prevRecipesNameArray = [];
      var allRecipes = [];
      allRecipes = await grabRecipes();
      for(let i = 0; i < allRecipes.length; i++) {
        let recipe = allRecipes[i];
        prevRecipesNameArray.push(recipe.name);
      }
      recipesArray = allRecipes;
  } catch(error) {
      console.log(error);
  }
}