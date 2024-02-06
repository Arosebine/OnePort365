require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const connectDB = require('../taskProcessor/database/taskWorker');
const cors = require('cors')
const cluster = require("cluster")
const CPU_CORE = 2;
const { receiveMessage } = require("../taskProcessor/services/fetch_task");



const app = express();
connectDB();


if(cluster.isMaster){
    console.log(`Master is up PID: ${process.pid}`)
    for(var i=0;i<CPU_CORE;i++){
        cluster.fork();
    }
}else{
    console.log(`Worker is up PID: ${process.pid}`)
    receiveMessage();
}




