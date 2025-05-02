const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

var {changeID, getID} = require('../public/javascripts/id');

// Render login page
router.get("/login", (req, res) => {
  if (getID() != null) {
    res.redirect('/main');
  } else {
    res.render('login')
  }
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
        recipes: null,
        dislikes: null
      });
    }

    console.log("User logged in:", uid);
    changeID(uid);
    return res.sendStatus(200);
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Functions using admin.firestore()

async function grabRecipes() {
  if (getID()) {
    const docSnap = await db.doc(`users/${getID()}`).get();
    return docSnap.exists ? docSnap.data().recipes : null;
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
async function setPreferences(prefStrings) {
  if (getID()) {
    await db.doc(`users/${getID()}`).set({ preferences: prefStrings }, { merge: true });
  }
}

async function addDislikes(newDislike) {
  if (getID()) {
    await db.doc(`users/${getID()}`).update({
      allergies: admin.firestore.FieldValue.arrayUnion(allString)
    });
  }
}
async function removeDislike(newDislike) {
  if (getID()) {
    await db.doc(`users/${getID()}`).update({
      allergies: admin.firestore.FieldValue.arrayRemove(allString)
    });
  }
}

async function addAllergy(allString) {
  if (getID()) {
    await db.doc(`users/${getID()}`).update({
      allergies: admin.firestore.FieldValue.arrayUnion(allString)
    });
  }
}

async function removeAllergy(allString) {
  if (getID()) {
    await db.doc(`users/${getID()}`).update({
      allergies: admin.firestore.FieldValue.arrayRemove(allString)
    });
  }
}

async function addRecipe(recipe) {
  if (getID()) {
    await db.doc(`users/${getID()}`).update({
      recipes: admin.firestore.FieldValue.arrayUnion(recipe)
    });
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