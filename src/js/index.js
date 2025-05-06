
// import { auth, RecaptchaVerifier, db } from './setup.js';
// import { signInWithPhoneNumber } from 'firebase/auth';
// import { doc, getDoc } from "firebase/firestore"; // Firestore functions

// let confirmationResult;

// document.addEventListener('DOMContentLoaded', () => {
// 	const sendOTPButton = document.getElementById('send-otp-button');
// 	const verifyOTPButton = document.getElementById('verify-otp-button');

// 	// Initialize reCAPTCHA once on DOM ready
// 	if(!window.recaptchaVerifier || !window.recaptchaWidgetId){
// 		window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
// 			'size': 'invisible', // You can use 'normal' for visible checkbox
// 			'callback': (response) => {
// 				console.log('reCAPTCHA solved:', response);
// 				// sendOTP(); // proceed only after reCAPTCHA is solved
// 			},
// 			'expired-callback': () => {
// 				console.log('reCAPTCHA expired. Please solve again.');
// 			}
// 		}, auth);
	
// 		// Renders the invisible reCAPTCHA
// 		window.recaptchaVerifier.render().then(widgetId => {
// 			window.recaptchaWidgetId = widgetId;
// 		});
// 	}
	

// 	// Click handler for sending OTP
// 	sendOTPButton.addEventListener('click', (e) => {
// 		e.preventDefault();
// 		// sendOTP();
// 		window.recaptchaVerifier.verify() // triggers reCAPTCHA and then callback will call sendOTP()
// 			.then((token) => {
// 				console.log("Token received from .verify():", token); // <-- ✅
// 				sendOTP();
// 			})
// 			.catch(err => {
// 				console.error("reCAPTCHA verification error", err);
// 			});
// 	});

// 	// Function to send OTP (called from reCAPTCHA callback)
// 	function sendOTP() {
// 		const phone = document.getElementById("phone").value;
// 		const appVerifier = window.recaptchaVerifier;

// 		signInWithPhoneNumber(auth, phone, appVerifier)
// 			.then((result) => {
// 				confirmationResult = result;
// 				alert("OTP sent successfully.");
// 			})
// 			.catch((error) => {
// 				console.error("Error during signInWithPhoneNumber:", error);
// 				alert("Failed to send OTP. Check console for details.");
// 			});
// 	}

// 	// Click handler for verifying OTP
// 	verifyOTPButton.addEventListener('click', (e) => {
// 		e.preventDefault();
// 		const code = document.getElementById("otp").value;
		
// 		if (!confirmationResult) {
// 			alert("OTP has not been sent yet.");
// 			return;
// 		}
// 		confirmationResult.confirm(code)
// 			.then(async (result) => {
// 				// alert("OTP verified. Redirecting...");
// 				// setTimeout(() => {
// 				// 	window.location.href = '/user_home_page.html';
// 				// }, 500);
// 				alert("OTP verified. Fetching user details...");
// 				const user = result.user;
// 				console.log("User signed in:", user);

// 				// Now fetch user data from Firestore
// 				const userRef = doc(db, "users", user.phoneNumber);
// 				const userSnap = await getDoc(userRef);

// 				if (userSnap.exists()) {
// 					const userData = userSnap.data();
// 					console.log("User data:", userData);

// 					// Save data to sessionStorage or localStorage to use on next page
// 					sessionStorage.setItem('userData', JSON.stringify(userData));

// 					setTimeout(() => {
// 						window.location.href = '/user_home_page.html';
// 					}, 500);
// 				} else {
// 					alert("No user data found. Please complete your profile.");

// 					// Redirect to a page where user fills in details
// 					window.location.href = '/register_profile_page.html';
// 				}
// 			})
// 			.catch((error) => {
// 				console.error("Error verifying OTP:", error);
// 				alert("Incorrect OTP or verification failed.");
// 			});
		
	
// 	});
// });

import { auth, RecaptchaVerifier, db } from './setup.js';
import { signInWithPhoneNumber } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore"; // Firestore functions

let confirmationResult;

document.addEventListener('DOMContentLoaded', () => {
    const sendOTPButton = document.getElementById('send-otp-button');
    const verifyOTPButton = document.getElementById('verify-otp-button');

    let recaptchaInitialized = false; // Flag to track initialization

    // Initialize reCAPTCHA once on DOM ready
    if(!window.recaptchaVerifier || !window.recaptchaWidgetId){
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible', // You can use 'normal' for visible checkbox
            'callback': (response) => {
                console.log('reCAPTCHA solved:', response);
                // sendOTP(); // proceed only after reCAPTCHA is solved
            },
            'expired-callback': () => {
                console.log('reCAPTCHA expired. Please solve again.');
            }
        }, auth);

        // Renders the invisible reCAPTCHA
        window.recaptchaVerifier.render().then(widgetId => {
            window.recaptchaWidgetId = widgetId;
            recaptchaInitialized = true; // Set flag after successful rendering
        });
    } else {
        recaptchaInitialized = true; // If already initialized
    }


    // Click handler for sending OTP
    sendOTPButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!recaptchaInitialized) {
            console.error("reCAPTCHA not yet initialized.");
            alert("reCAPTCHA is still loading. Please try again in a moment.");
            return;
        }
        window.recaptchaVerifier.verify() // triggers reCAPTCHA and then callback will call sendOTP()
            .then((token) => {
                console.log("Token received from .verify():", token); // <-- ✅
                sendOTP();
            })
            .catch(err => {
                console.error("reCAPTCHA verification error", err);
                alert("reCAPTCHA verification failed. Please try again."); // Inform user about reCAPTCHA failure
            });
    });

    // Function to send OTP (called after reCAPTCHA verification)
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
            confirmationResult = result;
            alert("OTP sent successfully.");
        } catch (error) {
            console.error("Error during signInWithPhoneNumber:", error);
            alert("Failed to send OTP. Check console for details.");
        }
    }

    // Click handler for verifying OTP
    verifyOTPButton.addEventListener('click', (e) => {
        e.preventDefault();
        const code = document.getElementById("otp").value;

        if (!confirmationResult) {
            alert("OTP has not been sent yet.");
            return;
        }
        confirmationResult.confirm(code)
            .then(async (result) => {
                alert("OTP verified. Fetching user details...");
                const user = result.user;
                console.log("User signed in:", user);

                // Now fetch user data from Firestore
                const userRef = doc(db, "users", user.phoneNumber);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const userData = userSnap.data();
                    console.log("User data:", userData);

                    // Save data to sessionStorage or localStorage to use on next page
                    sessionStorage.setItem('userData', JSON.stringify(userData));

                    setTimeout(() => {
                        window.location.href = '/user_home_page.html';
                    }, 500);
                } else {
                    alert("No user data found. Please complete your profile.");

                    // Redirect to a page where user fills in details
                    window.location.href = '/register_profile_page.html';
                }
            })
            .catch((error) => {
                console.error("Error verifying OTP:", error);
                alert("Incorrect OTP or verification failed.");
            });


    });
});