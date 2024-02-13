const express = require('express')
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/users');
const bcrypt = require('bcrypt');
const app = express();
const port = process.env.PORT || 4000; 

// connect to database

const dbURI = process.env.MONGO_URL
mongoose
.connect(dbURI)
.then(() => {
    app.listen(port, () => {
        console.log(`Server connected to port ${port} and MongoDb`)
    })
})
.catch((error) => {
    console.log('Unable to connect to Server and/or MongoDB', error)
})


//middleware
app.use(bodyParser.json())
app.use(cors())

//routes 

app.get('/', (req,res)=>{
    res.send('Samuel Kariuki');
})

//signup route

app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ name, email, password: hashedPassword})
        await newUser.save()
        res.status(201).json({ message: 'User created successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Error signing up' })
    }
})

// get users

app.get('/signup', async (req, res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
        
    } catch (error) {
        res.status(500).json({ error: 'Unable to get users' })
    }
})


// login user

app.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body
        const user = await User.findOne({ name })
        if (!user)  return res.status(401).json({ error: 'user does not exist'})
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) return res.status(401).json({ error: 'Invalid password' })
        
        res.json({ message: 'Login successful' })
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' })
    }
})


