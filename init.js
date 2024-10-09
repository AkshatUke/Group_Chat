const mongoose = require("mongoose");
const Chat = require("./models/chats.js");

main()
    .then(() => {
        console.log("Connection Succesfull");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allchats = [
    {
        from: "Akshat",
        to: "Priyanshu",
        msg: "Ek bhi nai Haaa",
        created_at: new Date(),
    },
    {
        from: "Nihar",
        to: "Priyanshu",
        msg: "Ghumne chal ra hai kya",
        created_at: new Date(),
    },
    {
        from: "Priyanshu",
        to: "Akshat",
        msg: "Ghumne chal ra hai kya",
        created_at: new Date(),
    },
]

Chat.insertMany(allchats);