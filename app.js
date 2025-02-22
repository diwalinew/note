// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAw6k93As_TuD5ANlHrC7iUMzInhJYZrJE",
  authDomain: "notee-9f105.firebaseapp.com",
  projectId: "notee-9f105",
  storageBucket: "notee-9f105.firebasestorage.app",
  messagingSenderId: "536264700477",
  appId: "1:536264700477:web:7c598c8fa00fdf837db054"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const noteInput = document.getElementById('note-input');
const addNoteButton = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');

// Handle adding a new note
addNoteButton.addEventListener('click', async () => {
  const noteText = noteInput.value.trim();
  if (noteText) {
    try {
      await addDoc(collection(db, 'notes'), { text: noteText });
      noteInput.value = '';
    } catch (error) {
      console.error("Add note error:", error);
      alert("Failed to add note: " + error.message);
    }
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

// Load notes when the page loads
loadNotes();
