'use strict'

const mongoose = require('mongoose')
const app = require('./app')
const config = require('./src/config')


console.log(config.MONGO_URI)
mongoose.connect(
    config.MONGO_URI,
    {
        useFindAndModify: false,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
    , (err, resp) => {
        if (err) {
            console.log(`failed to connect to the db ${err}`)
        }

        console.log("connection established");
        app.listen(config.PORT, () => {
            console.log(`Server listen in http://localhost:${config.PORT}`)
        })
    })
