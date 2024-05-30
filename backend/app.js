const express = require("express");
const app = express();
// changed port to 8888 because 8000 and 5000 were already in use
const port = 8888;
app.use(express.json());

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// same as importing firebase, but for express
const db = require('./firebase');
const { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } = require("firebase/firestore"); 

// get all posts
app.get("/posts", async (req, res) => {
    try {
        let data = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        res.status(200).json(data);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// update message
app.put("/posts/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const currentMessage = req.body.currentMessage;
        await updateDoc(doc(db, "users", id), {
            message: currentMessage,
        });
        res.status(200).json({ message: "success" });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// add message
app.post("/users", async (req, res) => {
    try {
        const first = req.body.name;
        const message = req.body.message;
        const docRef = await addDoc(collection(db, "users"), {
            name: first,
            message: message,
        });
        res.status(200).json({message: `Successfully created user with id ${docRef.id}`})
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// delete message
app.delete("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await deleteDoc(doc(db, "users", id));
        res.status(200).json({ message: "success"});
    } catch (e) {
        res.status(400).json({ error: e.message});
    }
})

