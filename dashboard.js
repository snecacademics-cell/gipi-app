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

// നിങ്ങൾ ആവശ്യപ്പെട്ടതുപോലെയുള്ള കൃത്യമായ സെമസ്റ്റർ / ക്ലാസ് ക്രമീകരണം
const streamSemesters = {
    "SHE": Array.from({length: 10}, (_, i) => `Sem ${i + 1}`),         // 10 Semesters
    "SHE PLUS": Array.from({length: 16}, (_, i) => `Sem ${i + 1}`),    // 16 Semesters
    "SHARIA PLUS": Array.from({length: 20}, (_, i) => `Sem ${i + 1}`), // 20 Semesters
    "SHARIA": Array.from({length: 16}, (_, i) => `Sem ${i + 1}`),      // 16 Semesters
    "BAITHUL AYN": Array.from({length: 20}, (_, i) => `Sem ${i + 1}`)  // 20 Semesters
};

function showCustomModal(title, message, isSuccess = true) {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalMessage').innerText = message;
    
    const iconContainer = document.getElementById('modalIconContainer');
    const icon = document.getElementById('modalIcon');
    
    if (isSuccess) {
        iconContainer.className = "modal-icon success";
        icon.className = "fa-solid fa-circle-check";
    } else {
        iconContainer.className = "modal-icon error";
        icon.className = "fa-solid fa-circle-exclamation";
    }
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('customModal').style.display = 'none';
}

// Enter Key Navigation (Tab Behavior)
document.addEventListener('DOMContentLoaded', () => {
    const formFields = document.querySelectorAll('#perfForm input, #perfForm select');
    formFields.forEach((field, index) => {
        field.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const nextField = formFields[index + 1];
                if (nextField) {
                    nextField.focus();
                } else {
                    document.querySelector('.submit-btn').click();
                }
            }
        });
    });
});

auth.onAuthStateChanged((user) => {
    if (user) {
        const emailParts = user.email.split('@');
        const affiliationNo = emailParts[0].trim();
        
        db.collection("colleges").doc(affiliationNo).get().then((doc) => {
            if (doc.exists) {
                const collegeData = doc.data();
                // കോളേജിന്റെ പേര് കൂടുതൽ ബ്രൈറ്റായി ഹെഡറിൽ കാണിക്കുന്നു
                document.getElementById('collegeTitle').innerText = `${collegeData.affiliationNo} - ${collegeData.collegeName}`;
                
                let stream = collegeData.stream ? collegeData.stream.trim().toUpperCase() : "SHE";
                if (!streamSemesters[stream]) {
                    stream = "SHE";
                }

                document.getElementById('streamBadge').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> സ്ട്രീം: ${stream}`;

                const classSelect = document.getElementById('classSelect');
                classSelect.innerHTML = '<option value="">സെമസ്റ്റർ തിരഞ്ഞെടുക്കുക</option>';
                
                streamSemesters[stream].forEach(sem => {
                    const option = document.createElement('option');
                    option.value = sem;
                    option.textContent = sem;
                    classSelect.appendChild(option);
                });

            } else {
                document.getElementById('collegeTitle').innerText = `അഫിലിയേഷൻ നം ${affiliationNo} - കോളേജ് ഡാറ്റ ലഭ്യലല്ല`;
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

    const resultDiv = document.getElementById('resultOutput');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        തിരഞ്ഞെടുത്ത സെമസ്റ്റർ: ${selectedClass} <br>
        മതപരം പെർസെന്റേജ്: ${relPercentage.toFixed(2)}% &nbsp;|&nbsp; ഭൗതികം പെർസെന്റേജ്: ${secPercentage.toFixed(2)}% <br>
        ആകെ GIPI സ്കോർ: ${overallPercentage.toFixed(2)}%
    `;

    const user = auth.currentUser;
    if (user) {
        const affiliationNo = user.email.split('@')[0];
        db.collection("colleges").doc(affiliationNo).collection("marks").add({
            semester: selectedClass,
            relObtained, relTotal, secObtained, secTotal, overallPercentage,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            showCustomModal("വിജയകരമാണ്", "മാർക്കുകൾ വിജയകരമായി ഡാറ്റാബേസിൽ സേവ് ചെയ്യപ്പെട്ടു!", true);
        }).catch((error) => {
            console.error("Error saving marks: ", error);
            showCustomModal("പിശക് സംഭവിച്ചു", "മാർക്കുകൾ സേവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.", false);
        });
    }
});
