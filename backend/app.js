const express = require("express");
const app = express();
// changed port to 8000 because 5000 was already in use
const port = 8000;
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// same as importing firebase, but for express
const db = require('./firebase');
const { collection, getDocs, updateDoc, doc, addDoc } = require("firebase/firestore"); 