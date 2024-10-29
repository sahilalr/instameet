// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, push, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-cIskB6q1aJgKL5ppmkexZuad7rmTLUg",
    authDomain: "instameet-61244.firebaseapp.com",
    projectId: "instameet-61244",
    storageBucket: "instameet-61244.appspot.com",
    messagingSenderId: "330108503008",
    appId: "1:330108503008:web:6348ddc847784700aae185"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 

// Form and List elements
const linkForm = document.getElementById('linkForm');
const nameInput = document.getElementById('nameInput'); // Add this input in HTML
const linkInput = document.getElementById('linkInput');
const linkList = document.getElementById('linkList');

// Initialize Firebase Database reference
const database = getDatabase(app, "https://instameet-61244-default-rtdb.asia-southeast1.firebasedatabase.app");
const linksRef = ref(database, 'links');

// Function to update the link list from Firebase
function updateLinkList(snapshot) {
    linkList.innerHTML = ''; // Clear the current list

    snapshot.forEach((childSnapshot) => {
        const linkData = childSnapshot.val();
        const li = document.createElement('li');
        const button = document.createElement('button');
        
        // Use the name for display, fallback to URL if no name
        button.textContent = linkData.name || linkData.url;
        button.className = 'link-button';
        
        // Add click handler to open the link
        button.onclick = () => window.open(linkData.url, '_blank');
        
        li.appendChild(button);
        linkList.prepend(li);
    });
    console.log(snapshot.val());
}

// Listen for link additions/removals in real-time
onValue(query(linksRef, limitToLast(30)), updateLinkList);

// Handle form submission to add a new link
// Handle form submission to add a new link
linkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newName = nameInput.value.trim();
    const newLink = linkInput.value.trim();
    console.log("Link submitted: ", newLink);

    // Validate if the link is an Instagram group link
    const validLinkPattern = /^(https:\/\/(?:www\.|ig\.me\/|instagram\.com\/group\/))[\w.-]+/;

    if (newLink && validLinkPattern.test(newLink)) {
        // Check if the link already exists in the database
        onValue(linksRef, (snapshot) => {
            let linkExists = false;

            snapshot.forEach((childSnapshot) => {
                const linkData = childSnapshot.val();
                if (linkData.url === newLink) {
                    linkExists = true;
                }
            });

            if (linkExists) {
                alert("This link already exists. Please submit a unique link.");
                console.log("Duplicate link detected, submission prevented.");
            } else {
                // Add the new link to Firebase
                push(linksRef, {
                    name: newName,
                    url: newLink
                });

                // Clear input fields
                nameInput.value = '';
                linkInput.value = '';
                console.log("Link added to Firebase.");
            }
        }, { onlyOnce: true });  // Only fetch data once for this check
    } else {
        alert('Please enter a valid Instagram group link.');
        console.log("Invalid link.");
    }
});
