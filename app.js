require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const Str = require('@supercharge/strings')


const app = express();
app.use(express.json());

const User = require('./models/User');
const checkToken = require('./models/checkToken.js');
const sendEmail = require('./controller/sendEmail');

//permissão cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

//rota de entrada(publica)
app.get('/', checkToken, (req, res) => {
    res.status(200).json({ msg: 'Bem vindo meu chapa' })
});


app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id, '-password');

    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    res.status(200).json({ user })

});

//registrar usuario
app.post('/auth/register', async (req, res) => {

    const { name, birthDate, email, phoneNumber, cpf, password, confirmPassword } = req.body;

    if (!name) {
        return res.status(422).json({ msg: "Por favor insira o nome" })
    }
    if (!birthDate) {
        return res.status(422).json({ msg: "Sem data de nascimento" })
    }
    if (!email) {
        return res.status(422).json({ msg: "Por favor insira o email" })
    }
    if (!phoneNumber) {
        return res.status(422).json({ msg: "Sem numero de telefone" })
    }
    if (!cpf) {
        return res.status(422).json({ msg: "Sem cpf" })
    }
    if (!password) {
        return res.status(422).json({ msg: "Por favor insira a senha" })
    }
    if (!confirmPassword) {
        return res.status(422).json({ msg: "Por favor confirme a senha" })
    }
    if (password != confirmPassword) {
        return res.status(422).json({ msg: "Senhas não coincidem, por favor tente novamente" })
    }

    const userExists = await User.findOne({ email: email });

    if (userExists) {
        return res.status(422).json({ msg: "Email já cadastrado" })
    }

    //criar senha
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const token = Str.random(80);

    const user = new User({
        name,
        birthDate,
        email,
        phoneNumber,
        cpf,
        password: passwordHash,
        activationToken: token,
        active: false
    })

    try {

        await user.save();
        res.status(201).json({
            msg: 'Usuário criado com sucesso',
            code: 200
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Aconteceu um erro, tente novamente mais tarde',
            code: 500
        })
    }

    try {
        const newEmail = await sendEmail(email, token);
        console.log(newEmail);
    } catch (error) {
        res.status(500).json({
            msg: 'Aconteceu um erro, tente novamente mais tarde',
            code: 500
        })
    }


});


app.post('/auth/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ msg: "Por favor insira o email" })
    }
    if (!password) {
        return res.status(422).json({ msg: "Por favor insira a senha" })
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(200).json({ msg: "Usuário não encontrado", code: 456});
    }
    if (!user.active) {
        return res.status(200).json({ msg: "Usuário não ativado", code: 457});
    }
    

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        return res.status(200).json({ msg: "Senha incorreta", code: 456})
    }

    try {

        const secret = process.env.SECRET;

        const token = jwt.sign(
            {
                id: user._id,
            }, secret,
            {
                expiresIn: 60
            }
        )

        res.status(200).json({ msg: "Login Realizado com sucesso", code: 200, token })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "deu ruim nesse token ai"
        })
    }

});


app.post('/confirmAccount', async(req, res) => {
    const { token } = req.body;

    try {

        await User.findOneAndUpdate({ activationToken: token }, { $set: {active: true}});
        res.status(201).json({
            msg: 'Usuário ativado com sucesso',
            code: 200
        });

    } catch (error) {
        res.status(500).json({
            msg: 'Aconteceu um erro, tente novamente mais tarde',
            code: 500
        })
    }
})

//conectar ao banco
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.xuikmh6.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    app.listen(process.env.PORT || 3000)
    console.log('Conectou no banco')
}).catch((err) => console.log(err))


