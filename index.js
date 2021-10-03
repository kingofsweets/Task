const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const app = express()

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use('/api/character', require('./routes/character.route'))
app.use('/api/relationship', require('./routes/relationship.route'))


async function start(){
    try {
        await mongoose.connect('mongodb+srv://kingofsweets:52868866@cluster0.h3yh8.mongodb.net/Olimp_Task?retryWrites=true&w=majority', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: true
        })

        app.listen(PORT, ()=> {
            console.log('Сервер запущен');
        })

    } catch (error) {
        console.error(error);
    }
}

start()
