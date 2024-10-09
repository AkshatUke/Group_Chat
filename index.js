const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chats.js");
const methodOverride = require('method-override')

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main()
    .then(() => {
        console.log("Connection Succesfull");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
});


//Create
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});
app.post("/chats", (req, res) => {
    let { from, msg, to } = req.body;
    let newchat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
    });
    newchat.save().then((res) => {
        console.log("Chat is saved");
    }).catch((err) => {
        console.log(err);
    });
    res.redirect("/chats");
});

//edit
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
});
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg } = req.body;
    let chat = await Chat.findByIdAndUpdate(id, { msg: msg }, { runValidators: true, new: true });
    res.redirect("/chats");
});

//destroy
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
});

app.get("/", (req, res) => {
    res.send("Working");
});

app.listen(8080, () => {
    console.log("app is listening to 8080 port");
});