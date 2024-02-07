const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Task Databse Connected")
    } catch (error) {
        console.log("Task Database Disconnected", error);
    }
}



module.exports = connectDB;