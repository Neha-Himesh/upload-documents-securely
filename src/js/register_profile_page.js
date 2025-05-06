// Import Firebase Firestore and Auth instances from your setup file
import { db } from './setup.js';
import { auth } from './setup.js';

// Import Firestore functions to save user data
import { doc, setDoc } from "firebase/firestore";

// Wait until the DOM is fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    
    // Get reference to the registration form element
    const registerPageForm = document.getElementById('register-page-form');

    // Form submission event listener
    registerPageForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form behavior (page reload)
        
        // Get currently authenticated user from Firebase Auth
        const user = auth.currentUser;
        if (!user) {
            alert('No user is logged in!');
            return;
        }

        // Retrieve name and email from form inputs
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = user.phoneNumber; // Use the phone number from the authenticated user

        try {
            // Save the user data in Firestore using phone number as the document ID
            await setDoc(doc(db, 'users', phone), {
                name,
                email,
                phone
            });

            // Store user data in sessionStorage for later use
            const userData = { name, email, phone };
            sessionStorage.setItem('userData', JSON.stringify(userData));

            // Notify the user and redirect to the user's home page
            alert('Profile saved successfully!');
            window.location.href = '/user_home_page.html';
        } catch (error) {
            // Log and alert in case of failure
            console.error('Error saving profile:', error);
            alert('Failed to save profile. See console for details.');
        }
    });
});
