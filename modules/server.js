require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const StoreModel = require('../src/database/models/store.model');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const checkToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (token) {
            try {
                const secret = process.env.SECRET;
                jwt.verify(token, secret);
            } catch (error) {
                res.status(400).send('Token inválido!');
            }
            next();
        } else {
            return res.status(401).json('Acesso negado!');
        }
    } else {
        res.status(401).send('Acesso negado!');
    }
}

app.get('/', (req, res) => {
    res.status(200).send('API de autenticação da loja');
});

app.get('/stores', async (req, res) => {
    try {
        const stores = await StoreModel.find({});
        res.status(200).json(stores);
    } catch (error) {
        res.status(500).send('Não foi possível listar as lojas!');
    }
});

app.get('/stores/:id', checkToken, async (req, res) => {
    const id = req.params.id;
    const store = await UserModel.findById(id, '-password');
    if (store) {
        return res.status(200).json(store);
    }
    res.status(404).send('Loja não encontrada!');
});

app.post('/register', async (req, res) => {

    const { name, email, password, address, phone, cnpj, cep, type } = req.body
    const storeExist = await StoreModel.findOne({ email: email });
    if (storeExist) {
        return res.status(422).send('Loja com esse e-mail já está cadastrado');
    }
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    const store = new StoreModel({
        name,
        email,
        password: passwordHash,
        address,
        phone,
        cnpj,
        cep,
        type
    });
    try {
        await store.save();
        res.status(201).json(store);
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const store = await StoreModel.findOne({ email: email });
    if (store) {
        const passwordMatch = await bcrypt.compare(password, store.password);
        if (passwordMatch) {
            try {
                const secret = process.env.SECRET;
                const token = jwt.sign({
                    id: store._id
                }, secret);
                return res.status(200).json({ message: `Bem vindo, ${store.name}!`, token });
            } catch (error) {
                res.status(500).send(error.message);
            }
        }
        return res.status(422).send('Senha inválida');
    }
    res.status(404).send("Loja não existe!");
});

app.patch('/stores/:id', checkToken, async (req, res) => {
    try {
        const id = req.params.id;
        const password = req.body.password;
        const store = await StoreModel.findByIdAndUpdate(id, req.body, { new: true });
        if (password) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            store.password = passwordHash;
        }
        res.status(200).json(store);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

const port = 2000;

app.listen(port, () => console.log(`Listening on port ${port}`));
