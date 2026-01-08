// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB3CFkxbQSqHkCNzBsAS0CvbbowRsvkio0",
    authDomain: "habilin-387ea.firebaseapp.com",
    projectId: "habilin-387ea",
    storageBucket: "habilin-387ea.firebasestorage.app",
    messagingSenderId: "872046933372",
    appId: "1:872046933372:web:b0fa5f63dbfbd60460e0f9",
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();

let isSignupMode = false;

function toggleAuthMode() {
    isSignupMode = !isSignupMode;
    const signupFields = document.getElementById('signupFields');
    const mainBtn = document.getElementById('mainAuthBtn');
    const formTitle = document.getElementById('formTitle');

    if (isSignupMode) {
        signupFields.style.display = 'block';
        mainBtn.textContent = 'Create Account';
        formTitle.textContent = '🧵 Weaver Sign Up';
    } else {
        signupFields.style.display = 'none';
        mainBtn.textContent = 'Login';
        formTitle.textContent = '🧵 Weaver Login';
    }
}

async function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    try {
        if (isSignupMode) {
            const role = document.getElementById('role').value;
            const name = document.getElementById('displayName').value;
            const result = await auth.createUserWithEmailAndPassword(email, password);
            await db.ref('users/' + result.user.uid).set({
                email, role, displayName: name || 'Weaver', createdAt: new Date().toISOString()
            });
            window.location.href = 'main.html';
        } else {
            await auth.signInWithEmailAndPassword(email, password);
            window.location.href = 'main.html';
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function showDashboard(user) {
    const welcome = document.getElementById('welcomeMessage');
    const roleEl = document.getElementById('userRole');
    
    const snapshot = await db.ref('users/' + user.uid).once('value');
    const data = snapshot.val();

    if (data) {
        if(welcome) welcome.textContent = `Welcome, ${data.displayName}! 🧵`;
        if(roleEl) roleEl.textContent = `Role: ${data.role}`;
    }
    loadPatterns(user.uid);
}

async function loadPatterns(userId) {
    const list = document.getElementById('patternsList');
    if (!list) return;

    const snapshot = await db.ref('patterns/' + userId).once('value');
    const patterns = snapshot.val();
    
    list.innerHTML = patterns 
        ? Object.keys(patterns).map(k => `<li>${patterns[k].name || k}</li>`).join('')
        : '<li>No patterns found.</li>';
}

function logout() {
    auth.signOut().then(() => window.location.href = 'login_signup.html');
}

function showAlert(msg, type) {
    const container = document.getElementById('alertContainer');
    if(!container) return;
    container.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
    setTimeout(() => container.innerHTML = '', 4000);
}

function connectDevice() {
    const indicator = document.querySelector('.device-indicator');
    indicator.classList.add('connected');
    document.getElementById('deviceStatus').innerText = "Device: Connected";
    showAlert("Device Linked!", "success");
}

function open3DViewer() {
    alert("3D Viewer is initializing...");
}