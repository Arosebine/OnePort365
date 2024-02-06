const taskUpdater = require("../controller/updateTask")

  
exports.performTask = (message)=>{
  console.log("message received: ", message);
    const messageObj = JSON.parse(message);
    const taskId = messageObj.id;
    const userId = messageObj.userId;
    const status = messageObj.status;
    const title = messageObj.title;
    const description = messageObj.description;
    const approvedBy = messageObj.userId;
    const result = taskUpdater.updateTask(taskId, userId, status, title, description, approvedBy);
    console.log("result: ", result);
    return result;
};