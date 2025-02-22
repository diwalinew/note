// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const toggleAuthModeButton = document.getElementById('toggle-auth-mode');
const signOutButton = document.getElementById('sign-out');
const notesSection = document.getElementById('notes-section');
const noteInput = document.getElementById('note-input');
const addNoteButton = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');

let isLogin = true;

// Toggle authentication mode
toggleAuthModeButton.addEventListener('click', () => {
  isLogin = !isLogin;
  toggleAuthModeButton.textContent = isLogin ? 'Switch to Sign Up' : 'Switch to Login';
  authForm.querySelector('button').textContent = isLogin ? 'Login' : 'Sign Up';
});

// Handle authentication form submission
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
  } catch (error) {
    alert(error.message);
  }
});

// Handle sign out
signOutButton.addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(error.message);
  }
});

// Handle adding a new note
addNoteButton.addEventListener('click', async () => {
  const noteText = noteInput.value.trim();
  if (noteText) {
    try {
      await addDoc(collection(db, 'notes'), { text: noteText });
      noteInput.value = '';
    } catch (error) {
      alert(error.message);
    }
  }
});

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    authSection.style.display = 'none';
    notesSection.style.display = 'block';
    signOutButton.style.display = 'block';
    loadNotes();
  } else {
    authSection.style.display = 'block';
    notesSection.style.display = 'none';
    signOutButton.style.display = 'none';
    notesList.innerHTML = '';
  }
});

// Load notes from Firestore
function loadNotes() {
  onSnapshot(collection(db, 'notes'), (snapshot) => {
    notesList.innerHTML = '';
    snapshot.forEach((doc) => {
      const note = doc.data();
      const li = document.createElement('li');
      li.textContent = note.text;
      notesList.appendChild(li);
    });
  });
}
