// ഫയർബേസ് കോൺഫിഗറേഷൻ
const firebaseConfig = {
    apiKey: "AIzaSyAoCSN0BznAiThsvUETim_cYDvOes4S2vI",
    authDomain: "gipi-app.firebaseapp.com",
    projectId: "gipi-app",
    storageBucket: "gipi-app.firebasestorage.app",
    messagingSenderId: "922633997761",
    appId: "1:922633997761:web:24abef2b23c2506cce3340",
    measurementId: "G-Z4G2JRGGDL"
};

// ഫയർബേസ് ഇനിഷ്യലൈസ് ചെയ്യുക
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 1. ലോഗിൻ ലോജിക്
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const affiliationNo = document.getElementById('affiliationNo').value;
        const password = document.getElementById('password').value;
        const email = `${affiliationNo}@gipi.edu`;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert('ലോഗിൻ വിജയകരമാണ്!');
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                document.getElementById('errorMsg').innerText = 'തെറ്റായ അഫിലിയേഷൻ നമ്പറോ പാസ്‌വേഡോ!';
                console.error(error.message);
            });
    });
}

// 2. സൈൻ-അപ്പ് (രജിസ്ട്രേഷൻ) ലോജിക്
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const regAffiliationNo = document.getElementById('regAffiliationNo').value;
        const regPassword = document.getElementById('regPassword').value;
        const email = `${regAffiliationNo}@gipi.edu`;

        auth.createUserWithEmailAndPassword(email, regPassword)
            .then((userCredential) => {
                alert('രജിസ്ട്രേഷൻ വിജയകരമാണ്! ഇപ്പോൾ ലോഗിൻ ചെയ്യാം.');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                document.getElementById('signupError').innerText = 'രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു: ' + error.message;
                console.error(error.message);
            });
    });
}
