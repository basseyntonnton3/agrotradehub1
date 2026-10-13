// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
 getFirestore,
 collection,
 getDocs,
 query,
 orderBy,
 limit
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
 apiKey: "AIzaSyDOt3HA2Z_oTgt7FrSt3F1nDI-soTmIwOs",
 authDomain: "agrotradehub-18b38.firebaseapp.com",
 databaseURL: "https://agrotradehub-18b38-default-rtdb.firebaseio.com",
 projectId: "agrotradehub-18b38",
 storageBucket: "agrotradehub-18b38.firebasestorage.app",
 messagingSenderId: "893086295049",
 appId: "1:893086295049:web:68159ce3ac62695798c4d8",
 measurementId: "G-385K6DR8BG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadMembers() {

 const container = document.getElementById("members-list");
 if (!container) return;

 try {
  const membersQuery = query(
   collection(db, "registrations"),
   orderBy("createdAt", "desc"),
   limit(6)
  );

  const snapshot = await getDocs(membersQuery);

  container.innerHTML = "";
  snapshot.forEach((doc) => {
   const member = doc.data();

   const card = document.createElement("div");
   card.className = "member-card";

   const image = document.createElement("img");
   image.src = member.image || member.photoURL || "";
   image.alt = member.name || "Member";
   image.onerror = () => image.style.display = "none";

   const name = document.createElement("h3");
   name.textContent = member.name || "ATH Member";

   const category = document.createElement("p");
   category.textContent =
    member.membership || member.category || "Member";

   card.append(image, name, category);
   container.appendChild(card);
  });

  if (snapshot.empty) {
   container.textContent = "No members found.";
  }
 } catch (error) {
  console.error("Error loading members:", error);
  container.textContent = "Unable to load members.";
 }
}

loadMembers();