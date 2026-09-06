// ഫയർബേസ് കോൺഫിഗറേഷൻ (ഫയർബേസ് പ്രൊജക്റ്റ് സെറ്റിങ്സിൽ നിന്ന് ലഭിക്കുന്ന വിവരങ്ങൾ ഇവിടെ നൽകുക)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
