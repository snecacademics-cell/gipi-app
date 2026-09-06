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

// സ്ട്രീമുകൾ അനുസരിച്ചുള്ള ക്ലാസുകൾ
const streamClasses = {
    "SHE": ["H1", "H2", "D1", "D2", "D3"],
    "SHARIA": ["H1", "H2", "D1", "D2", "D3", "D4", "PG1", "PG2"],
    "SHE PLUS": ["S1", "S2", "S3", "U1", "U2", "B1", "B2", "B3"],
    "SHARIA PLUS": ["S1", "S2", "S3", "U1", "U2", "B1", "B2", "B3"],
    "BAITHUL AYN": ["BS1", "BS2", "BS3", "BU1", "BU2", "BB1", "BB2", "BB3", "PG1", "PG2"]
};

auth.onAuthStateChanged((user) => {
    if (user) {
        const affiliationNo = user.email.split('@')[0];
        
        db.collection("colleges").doc(affiliationNo).get().then((doc) => {
            if (doc.exists) {
                const collegeData = doc.data();
                document.getElementById('collegeTitle').innerText = `${collegeData.affiliationNo} - ${collegeData.collegeName}`;
                
                // ഷീറ്റിൽ നിന്നെടുത്ത സ്ട്രീം കൃത്യമായി ക്ലീൻ ചെയ്ത് എടുക്കുന്നു
                let stream = collegeData.stream ? collegeData.stream.trim().toUpperCase() : "SHE";
                
                // ഒരുക്കിവെച്ച സ്ട്രീമുകളിൽ പെടാത്തതാണെങ്കിൽ ഡിഫോൾട്ടായി SHE വെക്കുന്നു
                if (!streamClasses[stream]) {
                    stream = "SHE";
                }

                document.getElementById('streamBadge').innerText = `സ്ട്രീം: ${stream}`;

                const classSelect = document.getElementById('classSelect');
                classSelect.innerHTML = '<option value="">ക്ലാസ് തിരഞ്ഞെടുക്കുക</option>';
                
                const classes = streamClasses[stream];
                classes.forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls;
                    option.textContent = cls;
                    classSelect.appendChild(option);
                });

            } else {
                document.getElementById('collegeTitle').innerText = "കോളേജ് വിവരങ്ങൾ ലഭ്യലല്ല";
            }
        }).catch((error) => {
            console.error("Error getting college data:", error);
        });
    } else {
        window.location.href = 'index.html';
    }
});

document.getElementById('perfForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedClass = document.getElementById('classSelect').value;
    const relObtained = parseFloat(document.getElementById('relObtained').value);
    const relTotal = parseFloat(document.getElementById('relTotal').value);
    const secObtained = parseFloat(document.getElementById('secObtained').value);
    const secTotal = parseFloat(document.getElementById('secTotal').value);

    const relPercentage = (relObtained / relTotal) * 100;
    const secPercentage = (secObtained / secTotal) * 100;
    const overallPercentage = ((relObtained + secObtained) / (relTotal + secTotal)) * 100;

    document.getElementById('resultOutput').innerHTML = `
        തിരഞ്ഞെടുത്ത ക്ലാസ്: ${selectedClass} <br>
        മതപരം പെർസെന്റേജ്: ${relPercentage.toFixed(2)}% &nbsp;|&nbsp; ഭൗതികം പെർസെന്റേജ്: ${secPercentage.toFixed(2)}% <br>
        ആകെ GIPI സ്കോർ: ${overallPercentage.toFixed(2)}%
    `;

    const user = auth.currentUser;
    if (user) {
        const affiliationNo = user.email.split('@')[0];
        db.collection("colleges").doc(affiliationNo).collection("marks").add({
            class: selectedClass,
            relObtained, relTotal, secObtained, secTotal, overallPercentage,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert('മാർക്കുകൾ വിജയകരമായി സേവ് ചെയ്യപ്പെട്ടു!');
        }).catch((error) => {
            console.error("Error saving marks: ", error);
        });
    }
});
