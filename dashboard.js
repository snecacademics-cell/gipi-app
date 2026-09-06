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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ലോഗിൻ ചെയ്ത യൂസറുടെ കോളേജ് പേര് ഓട്ടോമാറ്റിക്കായി കണ്ടെത്തി കാണിക്കുക
auth.onAuthStateChanged((user) => {
    if (user) {
        const affiliationNo = user.email.split('@')[0]; // ഉദാഹരണത്തിന് 18@gipi.edu എന്നതിൽ നിന്ന് 18 എടുക്കുന്നു
        
        db.collection("colleges").doc(affiliationNo).get().then((doc) => {
            if (doc.exists) {
                const collegeData = doc.data();
                document.getElementById('collegeTitle').innerText = collegeData.collegeName;
            } else {
                document.getElementById('collegeTitle').innerText = "കോളേജ് വിവരങ്ങൾ ലഭ്യലല്ല";
            }
        }).catch((error) => {
            console.error("Error getting college data:", error);
        });
    } else {
        // ലോഗിൻ ചെയ്തിട്ടില്ലെങ്കിൽ വീണ്ടും ലോഗിൻ പേജിലേക്ക് വിടുക
        window.location.href = 'index.html';
    }
});

// മാർക്ക് കാൽക്കുലേറ്റ് ചെയ്ത് സേവ് ചെയ്യുന്ന ഭാഗം
document.getElementById('perfForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const relObtained = parseFloat(document.getElementById('relObtained').value);
    const relTotal = parseFloat(document.getElementById('relTotal').value);
    const secObtained = parseFloat(document.getElementById('secObtained').value);
    const secTotal = parseFloat(document.getElementById('secTotal').value);

    const relPercentage = (relObtained / relTotal) * 100;
    const secPercentage = (secObtained / secTotal) * 100;
    const overallPercentage = ((relObtained + secObtained) / (relTotal + secTotal)) * 100;

    document.getElementById('resultOutput').innerHTML = `
        മതപരം പെർസെന്റേജ്: ${relPercentage.toFixed(2)}% <br>
        ഭൗതികം പെർസെന്റേജ്: ${secPercentage.toFixed(2)}% <br>
        ആകെ GIPI സ്കോർ: ${overallPercentage.toFixed(2)}%
    `;

    // ഫയർബേസിലേക്ക് ഡാറ്റ സേവ് ചെയ്യാം
    const user = auth.currentUser;
    if (user) {
        const affiliationNo = user.email.split('@')[0];
        db.collection("colleges").doc(affiliationNo).collection("marks").add({
            relObtained, relTotal, secObtained, secTotal, overallPercentage,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('മാർക്കുകൾ വിജയകരമായി സേവ് ചെയ്യപ്പെട്ടു!');
        }).catch((error) => {
            console.error("Error saving marks: ", error);
        });
    }
});
