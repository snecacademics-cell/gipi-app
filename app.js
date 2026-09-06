// ഫയർബേസ് കോൺഫിഗറേഷൻ (നിങ്ങളുടെ ഒറിജിനൽ വിവരങ്ങൾ ചേർത്തിരിക്കുന്നു)
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

// ലോഗിൻ ഫോം ഹാൻഡ്ലർ
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const affiliationNo = document.getElementById('affiliationNo').value;
        const password = document.getElementById('password').value;

        // അഫിലിയേഷൻ നമ്പർ ഇമെയിൽ രൂപത്തിലേക്ക് മാറ്റുന്നു
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
