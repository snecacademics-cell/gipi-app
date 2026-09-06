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

const streamClasses = {
    "SHE": ["H1", "H2", "D1", "D2", "D3"],
    "SHARIA": ["H1", "H2", "D1", "D2", "D3", "D4", "PG1", "PG2"],
    "SHE PLUS": ["S1", "S2", "S3", "U1", "U2", "B1", "B2", "B3"],
    "SHARIA PLUS": ["S1", "S2", "S3", "U1", "U2", "B1", "B2", "B3"],
    "BAITHUL AYN": ["BS1", "BS2", "BS3", "BU1", "BU2", "BB1", "BB2", "BB3", "PG1", "PG2"]
};

// Custom Modal Handler
function showCustomModal(title, message, isSuccess = true) {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalIcon = document.getElementById('modalIcon');
    const modalIconContainer = document.getElementById('modalIconContainer');

    modalTitle.innerText = title;
    modalMessage.innerText = message;
    
    if (isSuccess) {
        modalIconContainer.className = "modal-icon success";
        modalIcon.className = "fa-solid fa-circle-check";
    } else {
        modalIconContainer.className = "modal-icon error";
        modalIcon.className = "fa-solid fa-circle-exclamation";
    }
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('customModal').style.display = 'none';
}

// Enter Key Navigation
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

// ലോഗിൻ സ്റ്റേറ്റ് പരിശോധിച്ചു കോളേജ് ഡാറ്റ എടുക്കൽ
auth.onAuthStateChanged((user) => {
    if (user) {
        // യൂസർ ഇമെയിലിൽ നിന്ന് അഫിലിയേഷൻ നമ്പർ കൃത്യമായി എടുക്കുന്നു
        const emailParts = user.email.split('@');
        const affiliationNo = emailParts[0].trim();
        
        console.log("Logged in Affiliation No:", affiliationNo);

        db.collection("colleges").doc(affiliationNo).get().then((doc) => {
            if (doc.exists) {
                const collegeData = doc.data();
                document.getElementById('collegeTitle').innerText = `${collegeData.affiliationNo} - ${collegeData.collegeName}`;
                
                let stream = collegeData.stream ? collegeData.stream.trim().toUpperCase() : "SHE";
                if (!streamClasses[stream]) {
                    stream = "SHE";
                }

                document.getElementById('streamBadge').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> സ്ട്രീം: ${stream}`;

                const classSelect = document.getElementById('classSelect');
                classSelect.innerHTML = '<option value="">ക്ലാസ് തിരഞ്ഞെടുക്കുക</option>';
                
                streamClasses[stream].forEach(cls => {
                    const option = document.createElement('option');
                    option.value = cls;
                    option.textContent = cls;
                    classSelect.appendChild(option);
                });

            } else {
                document.getElementById('collegeTitle').innerText = `അഫിലിയേഷൻ നം ${affiliationNo} - കോളേജ് ഡാറ്റ ഫയർബേസിൽ കണ്ടെത്തിയില്ല`;
                document.getElementById('streamBadge').innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> സ്ട്രീം ലഭ്യമല്ല`;
            }
        }).catch((error) => {
            console.error("Error getting college data:", error);
            document.getElementById('collegeTitle').innerText = "ഡാറ്റ ലോഡ് ചെയ്യുന്നതിൽ പിശക് സംഭവിച്ചു";
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
            showCustomModal("വിജയകരമാണ്", "മാർക്കുകൾ വിജയകരമായി ഡാറ്റാബേസിൽ സേവ് ചെയ്യപ്പെട്ടു!", true);
        }).catch((error) => {
            console.error("Error saving marks: ", error);
            showCustomModal("പിശക് സംഭവിച്ചു", "മാർക്കുകൾ സേവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.", false);
        });
    }
});
