import { auth } from './setup.js';
import { signOut } from 'firebase/auth';


document.addEventListener('DOMContentLoaded', () => {
	const userData = JSON.parse(sessionStorage.getItem('userData'));
    const logoutBtn = document.getElementById('logout');

	if (!userData) {
		alert("Session expired. Please log in again.");
		window.location.href = 'index.html';
		return;
	}

	console.log("Logged-in user:", userData.name);

	// Update the sidebar or any element with the user's name
	const loggedInUserName = document.getElementsByClassName('user-home-page-username-display');
	if (loggedInUserName.length) {
		for(var i = 0; i < loggedInUserName.length; i ++){
			loggedInUserName[i].textContent = userData.name;
		}
		
	}
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);                      // Firebase logout
            sessionStorage.clear();                   // Clear session data
            window.location.href = '/index.html';     // Redirect to login page
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout failed.");
        }
    });
});
