// Import Firebase authentication module
import { auth } from './setup.js';

// Import the function to sign out users
import { signOut } from 'firebase/auth';

// Import utility to highlight the current active navigation item
import { highlightActiveNav } from './navbar.js';

// Import function to handle logout and session validation
import { logoutUserSession } from './logout_session.js';

// Check user session and set up logout functionality
logoutUserSession();

// Highlight the active nav link based on the current page URL
highlightActiveNav();
