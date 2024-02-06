require('dotenv').config()
const express = require("express")
const bodyParser = require('body-parser')
const connectDB = require('../taskUser/database/taskbase');
const cors = require('cors')
const userRoutes = require('../taskUser/routes/user.routes');
const taskRoutes = require('../taskUser/routes/task.routes');
const webhookRoutes = require('../taskUser/routes/webhook.routes');
const logger = require('../taskUser/utils/logger');



const app = express();
connectDB();
port = process.env.PORT || 3000;


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use((req, res, next) => {
    logger.info(req.method + " " + req.url);
    logger.info(req.body);
    logger.warn(req.query);
    logger.error(req.params);

    next();
});




app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/webhook', webhookRoutes);


app.listen(port,()=>{
    console.log("OnePort365 Server started on :http://localhost:"+port)
})

