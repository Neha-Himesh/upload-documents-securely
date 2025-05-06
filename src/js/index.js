// Import Firebase Authentication, reCAPTCHA, and Firestore
import { auth, RecaptchaVerifier, db } from './setup.js';
// Import Firebase Authentication function for signing in with phone number
import { signInWithPhoneNumber } from 'firebase/auth';
// Import Firestore functions for accessing user data
import { doc, getDoc } from "firebase/firestore";

let confirmationResult; // Stores OTP confirmation result for verification

// Execute after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get reference to the Send OTP and Verify OTP buttons
    const sendOTPButton = document.getElementById('send-otp-button');
    const verifyOTPButton = document.getElementById('verify-otp-button');

    let recaptchaInitialized = false; // Flag to prevent reinitialization

    // Initialize Firebase reCAPTCHA (invisible by default)
    if (!window.recaptchaVerifier || !window.recaptchaWidgetId) {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible', // Use 'normal' for visible checkbox if needed
            'callback': (response) => {
                // reCAPTCHA solved — token received
                console.log('reCAPTCHA solved:', response);
            },
            'expired-callback': () => {
                // Called when reCAPTCHA expires
                console.log('reCAPTCHA expired. Please solve again.');
            }
        }, auth);

        // Render the reCAPTCHA widget and store the widget ID
        window.recaptchaVerifier.render().then(widgetId => {
            window.recaptchaWidgetId = widgetId;
            recaptchaInitialized = true;
        });
    } else {
        recaptchaInitialized = true;
    }

    // Send OTP when "Send OTP" button is clicked
    sendOTPButton.addEventListener('click', (e) => {
        e.preventDefault();

        // Ensure reCAPTCHA is ready
        if (!recaptchaInitialized) {
            console.error("reCAPTCHA not yet initialized.");
            alert("reCAPTCHA is still loading. Please try again in a moment.");
            return;
        }

        // Trigger reCAPTCHA verification and call sendOTP on success
        window.recaptchaVerifier.verify()
            .then((token) => {
                console.log("Token received from .verify():", token);
                sendOTP(); // Proceed to send OTP
            })
            .catch(err => {
                console.error("reCAPTCHA verification error", err);
                alert("reCAPTCHA verification failed. Please try again.");
            });
    });

    // Function to send OTP to the entered phone number
    async function sendOTP() {
        const phone = document.getElementById("phone").value;

        if (!window.recaptchaVerifier) {
            console.error("reCAPTCHA verifier is not available.");
            alert("An error occurred. Please try again.");
            return;
        }

        try {
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, phone, appVerifier);
            confirmationResult = result; // Store confirmation result globally
            alert("OTP sent successfully.");
        } catch (error) {
            console.error("Error during signInWithPhoneNumber:", error);
            alert("Failed to send OTP. Check console for details.");
        }
    }

    // Verify OTP when "Verify OTP" button is clicked
    verifyOTPButton.addEventListener('click', (e) => {
        e.preventDefault();
        const code = document.getElementById("otp").value;

        if (!confirmationResult) {
            alert("OTP has not been sent yet.");
            return;
        }

        // Attempt to verify the entered OTP
        confirmationResult.confirm(code)
            .then(async (result) => {
                alert("OTP verified. Fetching user details...");
                const user = result.user;
                console.log("User signed in:", user);

                // Fetch user data from Firestore using phone number
                const userRef = doc(db, "users", user.phoneNumber);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    // If user data exists, save to session storage and redirect
                    const userData = userSnap.data();
                    console.log("User data:", userData);

                    sessionStorage.setItem('userData', JSON.stringify(userData));

                    // Redirect to user home page after short delay
                    setTimeout(() => {
                        window.location.href = '/user_home_page.html';
                    }, 500);
                } else {
                    // If no user data exists, redirect to registration page
                    alert("No user data found. Please complete your profile.");
                    window.location.href = '/register_profile_page.html';
                }
            })
            .catch((error) => {
                // Handle OTP verification failure
                console.error("Error verifying OTP:", error);
                alert("Incorrect OTP or verification failed.");
            });
    });
});
