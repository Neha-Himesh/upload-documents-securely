// // index.js
// import { auth, RecaptchaVerifier } from './setup.js';
// import { signInWithPhoneNumber } from 'firebase/auth';

// let confirmationResult;

// document.addEventListener('DOMContentLoaded', () => {
// 	const sendOTPButton = document.getElementById('send-otp-button');
// 	const verifyOTPButton = document.getElementById('verify-otp-button');

// 	sendOTPButton.addEventListener('click', () => {
// 		const phone = document.getElementById("phone").value;
// 		const recaptchaContainer = document.getElementById('recaptcha-container');
// 		// auth.settings.appVerificationDisabledForTesting = true;
// 		// console.log("auth settings in SignInForm", auth.settings+':here with :'+ auth.settings.appVerificationDisabledForTesting);
// 		console.log(`auth is ${auth}`);
// 		// Create reCAPTCHA verifier
// 		window.recaptchaVerifier = new RecaptchaVerifier(recaptchaContainer, {
// 			'size': 'invisible', // or 'normal'
// 			'callback': (response) => {
// 				console.log(`reCAPTCHA solved:`, response);
// 				signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
// 					.then((result) => {
// 						confirmationResult = result;
// 						alert("OTP Sent");
// 					})
// 					.catch((error) => {
// 						console.error("Error during signInWithPhoneNumber:", error);
// 					});
// 			},
// 			'expired-callback': () => {
//             console.log('reCAPTCHA token expired');
//             // Handle token expiry, e.g., re-render verifier
//         }
// 		}, auth);
// 		window.recaptchaVerifier.verify();

// 		console.log(`window.recaptchaVerifier is ${window.recaptchaVerifier}`);
// 		// // Send OTP
// 		// signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
// 		// 	.then((result) => {
// 		// 		confirmationResult = result;
// 		// 		alert("OTP Sent");
// 		// 	})
// 		// 	.catch((error) => {
// 		// 		console.error("Error during signInWithPhoneNumber:", error);
// 		// 	});
// 	});

// 	verifyOTPButton.addEventListener('click', () => {
// 		const code = document.getElementById("otp").value;

// 		if (!confirmationResult) {
// 			alert("OTP was not sent yet.");
// 			return;
// 		}

// 		confirmationResult.confirm(code)
// 			.then((result) => {
// 				const user = result.user;
// 				alert("OTP Verified!");
// 				window.location.href = 'dashboard.html';
// 			})
// 			.catch((error) => {
// 				console.error("Error verifying OTP:", error);
// 				alert("Incorrect OTP");
// 			});
// 	});
// });
// index.js
import { auth, RecaptchaVerifier } from './setup.js';
import { signInWithPhoneNumber } from 'firebase/auth';

let confirmationResult;

document.addEventListener('DOMContentLoaded', () => {
	const sendOTPButton = document.getElementById('send-otp-button');
	const verifyOTPButton = document.getElementById('verify-otp-button');

	// Initialize reCAPTCHA once on DOM ready
	window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
		'size': 'invisible', // You can use 'normal' for visible checkbox
		'callback': (response) => {
			console.log('reCAPTCHA solved:', response);
			sendOTP(); // proceed only after reCAPTCHA is solved
		},
		'expired-callback': () => {
			console.log('reCAPTCHA expired. Please solve again.');
		}
	}, auth);

	// Renders the invisible reCAPTCHA
	window.recaptchaVerifier.render().then(widgetId => {
		window.recaptchaWidgetId = widgetId;
	});

	// Click handler for sending OTP
	sendOTPButton.addEventListener('click', (e) => {
		e.preventDefault();
		window.recaptchaVerifier.verify() // triggers reCAPTCHA and then callback will call sendOTP()
			.then((token) => {
				console.log("Token received from .verify():", token); // <-- ✅
				// You can optionally call sendOTP() here instead of in callback
			})
			.catch(err => {
				console.error("reCAPTCHA verification error", err);
			});
	});

	// Function to send OTP (called from reCAPTCHA callback)
	function sendOTP() {
		const phone = document.getElementById("phone").value;
		const appVerifier = window.recaptchaVerifier;

		signInWithPhoneNumber(auth, phone, appVerifier)
			.then((result) => {
				confirmationResult = result;
				alert("OTP sent successfully.");
			})
			.catch((error) => {
				console.error("Error during signInWithPhoneNumber:", error);
				alert("Failed to send OTP. Check console for details.");
			});
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
			.then((result) => {
				alert("OTP verified. Redirecting...");
				window.location.href = 'dashboard.html';
			})
			.catch((error) => {
				console.error("Error verifying OTP:", error);
				alert("Incorrect OTP or verification failed.");
			});
	});
});

