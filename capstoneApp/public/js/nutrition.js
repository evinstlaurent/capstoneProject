import { app } from "./login.js";
import { getFirestore, doc, getDoc, arrayUnion, arrayRemove, updateDoc} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';
import { onAuthStateChanged, getAuth  } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
const auth = getAuth();
const db = getFirestore();
var currentUser = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user;
      // You can store user info or update UI here
    } else {
      window.location.href = "/login";
    }
  });
//This is a list of strings
async function grabRecipes() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        var data = docSnap.data();
        var recipes = data["recipes"];
        return recipes;
    } else {
        return null;
    }
}
//Given that it is a checklist, this is going to be a list of booleans
async function grabPreferences() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        var data = docSnap.data();
        var recipes = data["preferences"];
        return recipes;
    } else {
        return null;
    }
}

//this returns all the available allergies in a string form
async function grabAllergies() {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        var data = docSnap.data();
        var recipes = data["allergies"];
        return recipes;
    } else {
        return null;
    }
}
//Provide an array of boolean values in the same order the cheklist is ordered so that extracting is easier to parse.
async function setPreferences(prefStrings){
    if (!prefStrings){
        prefStrings = "";
    }
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
        preferences: prefStrings
    }, { merge: true });
}
//Give the name of the allergy you want to add
async function addAllergy(allString) {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
        allergies: arrayUnion(allString)
    }, { merge: true });
}
//Give the name of the allergy you want to remove
async function removeAllergy(allString) {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
        allergies: arrayRemove(allString)
    }, { merge: true });
}
//Just give the entire recipe as the parameter
async function addRecipe(recipe) {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
        recipes: arrayUnion(recipe)
    }, { merge: true });
}
//Use the text of the recipe you want to remove to delete it from the db
async function removeRecipe(oldRecipe) {
    const userRef = doc(db, "users", currentUser.uid);
    await updateDoc(userRef, {
        recipes: arrayRemove(oldRecipe)
    }, { merge: true });
}

document.addEventListener("DOMContentLoaded", () => {
    // All tab links and content sections
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const profilePage = document.querySelector('.profile-page');

    // Hide all content sections
    function hideAllContent() {
        tabContents.forEach((content) => content.classList.remove('active'));
        profilePage?.classList.remove('active');
    }

    // Show the clicked tab content
    function showTabContent(target) {
        const contentToShow = document.getElementById(target);

        if (target === 'profile') {
            profilePage?.classList.add('active');
        } else {
            contentToShow?.classList.add('active');
        }
    }


    // Add event listeners to each tab link
    tabLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();

            const targetTab = event.target.getAttribute('data-target');

            console.log('Tab clicked:', targetTab);
            hideAllContent();
            showTabContent(targetTab);

            // Add active class to the clicked link
            tabLinks.forEach((link) => link.classList.remove('active'));
            event.target.classList.add('active');

            if (targetTab !== 'profile') {
                profilePage?.classList.remove('active');
            }
        });
    });

    // Ensure profile does not persist on other tabs
    tabLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (event.target.getAttribute('data-target') !== 'profile') {
                profilePage?.classList.remove('active');
            }
        });
    });

    // Show the home tab content initially
    showTabContent('home');
    document.querySelector('.tab-link[data-target="home"]').classList.add('active');

    // Handle Profile Dropdown Toggle
    const profileIcon = document.getElementById("profile-icon");
    const profileDropdown = document.getElementById("profile-dropdown");

    profileIcon.addEventListener("click", () => {
        profileDropdown.classList.toggle("show");
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", (event) => {
        if (!profileIcon.contains(event.target)) {
            profileDropdown.classList.remove("show");
        }
    });

    // --- Navigate to Profile Form on Edit Profile Button Click ---
    const editProfileButton = document.getElementById("edit-profile-button");

    if (editProfileButton) {
        editProfileButton.addEventListener("click", () => {
            hideAllContent();  
            showTabContent('profile');  

            tabLinks.forEach((link) => link.classList.remove('active'));

            document.querySelector('.tab-link[data-target="profile"]').classList.add('active'); 
        });
    }


    // --- Button Handling ---
    function handleButtonClick(buttonId, callback) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", callback);
        } else {
            console.warn(`Button with ID "${buttonId}" not found.`);
        }
    }

    // --- Dietary Preferences Logic ---
    handleButtonClick("diet-submit-button", () => {
        const selectedDiets = [];
        document.querySelectorAll('.diet-options input[type="checkbox"]:checked').forEach((checkbox) => {
            selectedDiets.push(checkbox.value);
        });

        const customDietInput = document.getElementById("custom-diet-input")?.value.trim();
        if (customDietInput) {
            selectedDiets.push(customDietInput);
        }
        
        console.log(currentUser);
        setPreferences(selectedDiets);

        console.log("Dietary Preferences Saved:", selectedDiets.join(', '));
        alert("Dietary preferences updated successfully!");
    });

    // --- Allergy Logic ---
    handleButtonClick("add-allergy-button", () => {
        const allergyInput = document.getElementById("allergy-container input")?.value.trim();
        if (allergyInput) {
            const allergyList = document.getElementById("allergy-list");
            const newAllergyItem = document.createElement("li");
            newAllergyItem.textContent = allergyInput;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.innerHTML = '<i class="bx bxs-x-circle"></i>';
            removeBtn.classList.add("remove-allergy-button");
            
            removeBtn.addEventListener("click", () => newAllergyItem.remove());
    
            newAllergyItem.appendChild(removeBtn);
            allergyList.appendChild(newAllergyItem);

            document.getElementById("allergy-container input").value = "";
        }
    });

    handleButtonClick("allergy-submit-button", () => {
        const savedAllergies = [];
        document.querySelectorAll("#allergy-list li").forEach((allergy) => {
            savedAllergies.push(allergy.textContent.replace("Remove", "").trim());
        });

        console.log("Allergy Entries Saved:", savedAllergies.join(', '));
        alert("Allergies updated successfully!");
    });

    // --- Unpreferred Food Logic ---
    handleButtonClick("add-dislike-button", () => {
        const dislikeInput = document.getElementById("dislike-container input")?.value.trim();
        if (dislikeInput) {
            const dislikeList = document.getElementById("disliked-foods-list");
            const newDislikeItem = document.createElement("li");
            newDislikeItem.textContent = dislikeInput;

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "Remove";
            removeBtn.innerHTML = '<i class="bx bxs-x-circle"></i>';
            removeBtn.classList.add("remove-dislike-button");
            
            removeBtn.addEventListener("click", () => newDislikeItem.remove());
    
            newDislikeItem.appendChild(removeBtn);
            dislikeList.appendChild(newDislikeItem);

            document.getElementById("dislike-container input").value = "";
        }
    });

    handleButtonClick("dislike-submit-button", () => {
        const savedDislikes = [];
        document.querySelectorAll("#disliked-foods-list li").forEach((dislike) => {
            savedDislikes.push(dislike.textContent.replace("Remove", "").trim());
        });

        console.log("Disliked Food Entries Saved:", savedDislikes.join(', '));
        alert("Disliked Foods updated successfully!");
    });


    // --- Profile Update Logic ---
    handleButtonClick("profile-submit-button", () => {
        const username = document.getElementById("username")?.value.trim();
        const email = document.getElementById("email")?.value.trim();

        console.log("Profile Updated:", { username, email });
        alert("Profile updated successfully!");
    });
});

// --- Custom Diet Input Visibility Logic ---
const otherCheckbox = document.getElementById("other-checkbox");
const customDietSection = document.getElementById("custom-diet-section");

// Show the custom diet input if "Other" checkbox is selected
otherCheckbox.addEventListener("change", () => {
    if (otherCheckbox.checked) {
        customDietSection.style.display = "block"; 
    } else {
        customDietSection.style.display = "none"; 
    }
});

// Add Custom Dietary Preference Logic
const addCustomDietButton = document.getElementById("add-custom-diet-button");

if (addCustomDietButton) {
    addCustomDietButton.addEventListener("click", () => {
        const customDietInput = document.getElementById("custom-diet-input").value.trim();
        if (customDietInput) {
            const customDietValue = customDietInput.toLowerCase();
            const newDietItem = document.createElement("div"); 
            newDietItem.classList.add("custom-diet-item");

            // Create Checkbox and Label
            const newCheckbox = document.createElement("input");
            newCheckbox.type = "checkbox";
            newCheckbox.value = customDietValue;
            newCheckbox.checked = true; 

            const newLabel = document.createElement("label");
            newLabel.appendChild(newCheckbox);
            newLabel.appendChild(document.createTextNode(customDietValue));

            // Create Remove Button
            const removeBtn = document.createElement("button");
            removeBtn.innerHTML = '<i class="bx bxs-x-circle"></i>';
            removeBtn.classList.add("remove-diet-button");

            // Remove the custom preference when button is clicked
            removeBtn.addEventListener("click", () => newDietItem.remove());

            // Append elements
            newDietItem.appendChild(newLabel);
            newDietItem.appendChild(removeBtn);
            document.querySelector('.diet-options').appendChild(newDietItem);

            // Hide the input section and reset the input field
            customDietSection.style.display = "none";
            document.getElementById("custom-diet-input").value = "";
            otherCheckbox.checked = false; 
        }
    });
}
