// index.js
import { auth, RecaptchaVerifier } from './setup.js';
import { signInWithPhoneNumber } from 'firebase/auth';

let confirmationResult;

document.addEventListener('DOMContentLoaded', () => {
	const sendOTPButton = document.getElementById('send-otp-button');
	const verifyOTPButton = document.getElementById('verify-otp-button');

	sendOTPButton.addEventListener('click', () => {
		const phone = document.getElementById("phone").value;
		const recaptchaContainer = document.getElementById('recaptcha-container');
		auth.settings.appVerificationDisabledForTesting = true;
		console.log("auth settings in SignInForm", auth.settings+':here with :'+ auth.settings.appVerificationDisabledForTesting);
		console.log(`auth is ${auth}`);
		// Create reCAPTCHA verifier
		window.recaptchaVerifier = new RecaptchaVerifier(recaptchaContainer, {
			'size': 'invisible', // or 'normal'
			'callback': (response) => {
				console.log('reCAPTCHA solved');
			}
		}, auth);

		// Send OTP
		signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
			.then((result) => {
				confirmationResult = result;
				alert("OTP Sent");
			})
			.catch((error) => {
				console.error("Error during signInWithPhoneNumber:", error);
			});
	});

	verifyOTPButton.addEventListener('click', () => {
		const code = document.getElementById("otp").value;

		if (!confirmationResult) {
			alert("OTP was not sent yet.");
			return;
		}

		confirmationResult.confirm(code)
			.then((result) => {
				const user = result.user;
				alert("OTP Verified!");
				window.location.href = 'dashboard.html';
			})
			.catch((error) => {
				console.error("Error verifying OTP:", error);
				alert("Incorrect OTP");
			});
	});
});
