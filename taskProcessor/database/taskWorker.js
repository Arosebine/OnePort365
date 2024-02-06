const mongoose = require("mongoose")
// const cluster = require("cluster")
// const CPU_CORE = 2;

// const { receiveMessage } = require("../services/fetch_task");

const connectDB = async () => {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Task Databse Connected")
    } catch (error) {
        console.log("Task Database Disconnected", error);
    }
}


// if(cluster.isMaster){
//     console.log(`Master is up PID: ${process.pid}`)
//     for(var i=0;i<CPU_CORE;i++){
//         cluster.fork();
//     }
// }else{
//     console.log(`Worker is up PID: ${process.pid}`)
//     receiveMessage();
// }

module.exports = connectDB;