document.addEventListener('DOMContentLoaded', () => {
	const userData = JSON.parse(sessionStorage.getItem('userData'));

	if (!userData) {
		alert("Session expired. Please log in again.");
		window.location.href = 'index.html';
		return;
	}

	console.log("Logged-in user:", userData.name);

	// Update the sidebar or any element with the user's name
	const loggedInUserName = document.getElementById('user-home-page-username-display');
	if (loggedInUserName) {
		loggedInUserName.textContent = "Hi " + userData.name + "!";
	}
});
