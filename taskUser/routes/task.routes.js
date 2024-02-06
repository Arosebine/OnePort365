const express = require("express");
const router = express.Router();
const { auth } = require("../../taskUser/middlewares/auth");
const taskController = require("../controllers/task.controller");


router.use(auth);
router.get("/taskStatus/:taskId", taskController.getTaskById);
router.post("/createTask", taskController.createTask);
router.get("/getAllTask", taskController.getAllTasks);
router.put("/updateTask/:taskId", taskController.updateTask);
router.delete("/deleteTask/:taskId", taskController.deleteTask);

module.exports = router;