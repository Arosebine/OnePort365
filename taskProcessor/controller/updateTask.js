const taskModel = require("../model/TaskModel")

exports.updateTask = async (taskId, userId, status, title, description, approvedBy)=>{
    try{
        const updateResult = await taskModel.findOneAndUpdate(
            {_id: taskId}, 
            {
                status: "COMPLETED", 
                title:title, 
                description:description, 
                approvedBy:approvedBy
            },
            {
                new:true
            })
            console.log("task updated with id: "+taskId);
        return updateResult;
    }catch(error){
        console.log("Error updating task :"+error)
        return {
            error: error.message,
            message: "Error updating task"
        }
    }
    
}
