'use strict'

const express =  require('express');
const helmet = require("helmet");
const body_parser = require('body-parser');
const api = require('./src/routes/index');
const cors = require('cors');
const app = express();
const {NotFoundMiddleware,ErrorMiddleware,AuthMiddleware} = require('./src/middelwares'); 


const corsOptions = {
  origin : '*',
  methods : "GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS",
  preflightContinue : true,
  optionsSuccessStatus : 200 ,
  credentials : true,
  allowedHeaders : ['X-Requested-With, Content-Type,X-Amz-Date, Authorization, X-Api-Key, Origin, Accept, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Origin']
}

// Configurar cabeceras y cors include before other routes

app.options('*', cors());
app.use(cors(corsOptions));

app.use(body_parser.urlencoded({extended : true }));
app.use(body_parser.json());
app.use(helmet());


app.use('/api', api);

//MIDDLEWARES FOR ROUTES
app.use(NotFoundMiddleware);
app.use(ErrorMiddleware);

module.exports = app