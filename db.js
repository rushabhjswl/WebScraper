const mongoose = require('mongoose');

const MONGO_USERNAME = "admin";
const MONGO_PWD = "admin";
const MONGO_HOSTNAME = "127.0.0.1";
const MONGO_PORT = "27017";
const MONGO_DB = "admin";


const url = "mongodb://admin:admin@127.0.0.1:27017/admin";
//const url = "mongodb://${MONGO_USERNAME}:${MONGO_PWD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}";
mongoose.connect(url, {useNewUrlParser : true,  useFindAndModify: false });