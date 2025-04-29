import { db } from './setup.js'; // your Firestore setup
import { auth } from './setup.js';
import { doc, setDoc } from "firebase/firestore";

document.addEventListener('DOMContentLoaded', () => {
    
    const registerPageForm = document.getElementById('register-page-form');

    registerPageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) {
            alert('No user is logged in!');
            return;
        }

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = user.phoneNumber;

        try {
            await setDoc(doc(db, 'users', phone), {
                name,
                email,
                phone
            });
            const userData = { name, email, phone };
            sessionStorage.setItem('userData', JSON.stringify(userData));
            alert('Profile saved successfully!');
            window.location.href = '/user_home_page.html'; // redirect to home/dashboard
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile. See console for details.');
        }
    });
});