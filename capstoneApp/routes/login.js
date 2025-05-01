const express = require("express");
const admin = require("firebase-admin");

const router = express.Router();
const db = admin.firestore();

let currentUid = null;

// Render login page
router.get("/login", (req, res) => {
  res.render("login");
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
        recipes: null
      });
    }

    console.log("User logged in:", uid);
    currentUid = uid;
    return res.sendStatus(200);
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
});

// Functions using admin.firestore()

async function grabRecipes() {
  if (currentUid) {
    const docSnap = await db.doc(`users/${currentUid}`).get();
    return docSnap.exists ? docSnap.data().recipes : null;
  }
  return null;
}

async function grabPreferences() {
  if (currentUid) {
    const docSnap = await db.doc(`users/${currentUid}`).get();
    return docSnap.exists ? docSnap.data().preferences : null;
  }
  return null;
}

async function grabAllergies() {
  if (currentUid) {
    const docSnap = await db.doc(`users/${currentUid}`).get();
    return docSnap.exists ? docSnap.data().allergies : null;
  }
  return null;
}

async function setPreferences(prefStrings) {
  if (currentUid) {
    await db.doc(`users/${currentUid}`).set({ preferences: prefStrings }, { merge: true });
  }
}

async function addAllergy(allString) {
  if (currentUid) {
    await db.doc(`users/${currentUid}`).update({
      allergies: admin.firestore.FieldValue.arrayUnion(allString)
    });
  }
}

async function removeAllergy(allString) {
  if (currentUid) {
    await db.doc(`users/${currentUid}`).update({
      allergies: admin.firestore.FieldValue.arrayRemove(allString)
    });
  }
}

async function addRecipe(recipe) {
  if (currentUid) {
    await db.doc(`users/${currentUid}`).update({
      recipes: admin.firestore.FieldValue.arrayUnion(recipe)
    });
  }
}

async function removeRecipe(oldRecipe) {
  if (currentUid) {
    await db.doc(`users/${currentUid}`).update({
      recipes: admin.firestore.FieldValue.arrayRemove(oldRecipe)
    });
  }
}

module.exports = {
  router,
  grabRecipes,
  grabPreferences,
  grabAllergies,
  setPreferences,
  addAllergy,
  removeAllergy,
  addRecipe,
  removeRecipe
};