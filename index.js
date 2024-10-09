const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chats.js");
const methodOverride = require('method-override');

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main()
    .then(() => {
        console.log("Connection Successful");
    })
    .catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

// Get all chats
app.get("/chats", async (req, res) => {
    try {
        let chats = await Chat.find();
        res.render("index.ejs", { chats });
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).send("Error fetching chats.");
    }
});

// Create new chat
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/chats", async (req, res) => {
    let { from, msg, to } = req.body;
    let newchat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
    });
    try {
        await newchat.save();
        console.log("Chat is saved");
        res.redirect("/chats");
    } catch (err) {
        console.error("Error saving chat:", err);
        res.status(500).send("Error saving chat.");
    }
});

// Edit chat
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    try {
        let chat = await Chat.findById(id);
        if (!chat) {
            return res.status(404).send("Chat not found.");
        }
        res.render("edit.ejs", { chat });
    } catch (err) {
        console.error("Error fetching chat for edit:", err);
        res.status(500).send("Error fetching chat.");
    }
});

app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg } = req.body;
    try {
        let chat = await Chat.findByIdAndUpdate(id, { msg: msg }, { runValidators: true, new: true });
        if (!chat) {
            return res.status(404).send("Chat not found.");
        }
        res.redirect("/chats");
    } catch (err) {
        console.error("Error updating chat:", err);
        res.status(500).send("Error updating chat.");
    }
});

// Delete chat
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    try {
        let chat = await Chat.findByIdAndDelete(id);
        if (!chat) {
            return res.status(404).send("Chat not found.");
        }
        res.redirect("/chats");
    } catch (err) {
        console.error("Error deleting chat:", err);
        res.status(500).send("Error deleting chat.");
    }
});

// Home route
app.get("/", (req, res) => {
    res.send("Working");
});

app.listen(8080, () => {
    console.log("App is listening to port 8080");
});
