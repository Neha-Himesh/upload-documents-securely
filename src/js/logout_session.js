// Import Firebase Authentication instance
import { auth } from './setup.js';
// Import Firebase signOut function
import { signOut } from 'firebase/auth';

// Exported function to handle user session management and logout
export function logoutUserSession() {
    // Ensure DOM is fully loaded before accessing elements
    document.addEventListener('DOMContentLoaded', () => {
        // Retrieve user data from sessionStorage
        const userData = JSON.parse(sessionStorage.getItem('userData'));

        // Get reference to the logout button
        const logoutBtn = document.getElementById('logout');

        // If session is missing, redirect user to login page
        if (!userData) {
            alert("Session expired. Please log in again.");
            window.location.href = 'index.html';
            return;
        }

        // Display user's name in navbar (top section)
        const loggedInUserNameInNavbar = document.querySelector('.user-home-page-username-display-in-navbar');
        // Display personalized greeting if welcome element exists
        const loggedInUserNameInWelcomeElement = document.querySelector('.user-home-page-username-display-in-welcome-element');

        // Update UI elements with the user's name
        loggedInUserNameInNavbar.textContent = userData.name;
        if (loggedInUserNameInWelcomeElement) {
            loggedInUserNameInWelcomeElement.textContent = "Hi " + userData.name + ",";
        }

        // Logout functionality when logout button is clicked
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);                // Sign out from Firebase
                sessionStorage.clear();             // Clear user data from session
                window.location.href = '/index.html'; // Redirect to login page
            } catch (error) {
                console.error("Logout error:", error);
                alert("Logout failed.");           // Inform user of any error
            }
        });
    });
}
