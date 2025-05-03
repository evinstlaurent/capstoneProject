const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

var { changeID, getID } = require('../public/javascripts/id');
//const { Steps } = require("openai/resources/beta/threads/runs/steps.mjs");

// Render login page
router.get("/login", (req, res) => {
  res.render('login')
});

// Handle login POST
router.post("/login", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userRef = db.doc(`users/${uid}`);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {

      await userRef.set({
        uid,
        allergies: null,
        preferences: null,
        dislikes: null
      });
      const recipe = db.collection("users").doc(uid).collection("recipe");
    }

    console.log("User logged in:", uid);
    changeID(uid);
    return res.sendStatus(200);
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});
// If you dont want to worry about the time added just remove the orderBy from this function.
async function grabRecipes() {
  if (getID()) {
    var totalRecipes = [];
    const recipe = db.collection("users").doc(getID()).collection("recipe").orderBy("timeAdded", "desc");
    var values = await recipe.get();
    console.log("hi");
      values.forEach(doc => {
        totalRecipes.push(doc.data());
      });
    return totalRecipes;
  }
  return null;
}

async function grabPreferences() {
  if (getID()) {
    const docSnap = await db.doc(`users/${getID()}`).get();
    return docSnap.exists ? docSnap.data().preferences : null;
  }
  return null;
}

async function grabAllergies() {
  if (getID()) {
    const docSnap = await db.doc(`users/${getID()}`).get();
    return docSnap.exists ? docSnap.data().allergies : null;
  }
  return null;
}
async function grabDislikes() {
  if (getID()) {
    const docSnap = await db.doc(`users/${getID()}`).get();
    return docSnap.exists ? docSnap.data().dislikes : null;
  }
  return null;
}

async function addRecipe(name, ingredients, step) {
  if (getID()) {
    const recipe = db.collection("users").doc(getID()).collection("recipe");
    recipe.add({
      name: name,
      ingredients: ingredients,
      steps: step,
      timeAdded: admin.firestore.Timestamp.now()
    })
  }
}

async function removeRecipe(oldRecipe) {
  if (getID()) {
    await db.doc(`users/${getID()}`).update({
      recipes: admin.firestore.FieldValue.arrayRemove(oldRecipe)
    });
  }
}

module.exports = {
  router,
  grabRecipes,
  grabPreferences,
  grabAllergies,
  grabDislikes,
  addRecipe
};