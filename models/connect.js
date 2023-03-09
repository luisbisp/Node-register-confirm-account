const mongoose = require('mongoose');
const express = require('express');
const app = express();

//conectar ao banco
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.xuikmh6.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    app.listen(3000)
    console.log('Conectou no banco')
}).catch((err) => console.log(err))

module.exports = mongoose;