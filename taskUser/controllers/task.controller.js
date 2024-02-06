const Task = require('../models/task.model');
const User = require('../models/user.model');
const { rabbitmqService } = require('../service/rabbitmq.service');
const WebhookService = require('../controllers/webhook.controller');



exports.createTask = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        if (user.roles === "user") {
            const { title, description } = req.body;
            const newTask = await Task.create({
                title,
                description,
                userId: user._id,
                status: "PENDING"
            });
            const task = {
                id: newTask._id,
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                userId: newTask.userId,
                createdAt: newTask.createdAt,
                updatedAt: newTask.updatedAt
            }
            await rabbitmqService(task);
            return res.status(201).json({
                message: "Task created successfully",
                task
            })    
        }else{
            return res.status(400).json({
                message: "You must be registered user to create a task",
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}


exports.getAllTasks = async (req, res) => {
    try {
        const id = req.user;
        const user = await User.findById(id);
        if (user.roles === "user") {
        const tasks = await Task.find();
        return res.status(200).json({
            message: "All tasks",
            tasks
        })
    }else{
        return res.status(400).json({
            message: "You must be registered user to get all tasks",
        })
    }
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
}



// Controller method to get a task by ID
exports.getTaskById = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    if (user.roles === "user") {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ task });
}else{
    return res.status(400).json({
        message: "You must be registered user to get a task",
    })
}
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// Controller method to update a task by ID
exports.updateTask = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    if (user.roles === "user") {
    const taskId = req.params.taskId;
    const { title, description, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(taskId, 
        { title, description, status, approvedBy: user.firstName+""+user.lastName }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }  
    await rabbitmqService(updatedTask);
    return res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
}else{
    return res.status(400).json({
        message: "You must be registered user to update a task",
    })
}
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};

// Controller method to delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    if (user.roles === "user") {
    const taskId = req.params.taskId;
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await rabbitmqService(deletedTask);
    return res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
}else{
    return res.status(400).json({
        message: "You must be registered user to delete a task",
    })
}
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error });
  }
};


