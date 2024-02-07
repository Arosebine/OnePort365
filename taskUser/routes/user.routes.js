const express = require("express");
const limiter  = require("../middlewares/rateLimit");
const { auth } = require("../middlewares/auth");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.use(limiter);
router.post("/signup", userController.signUp);
router.post("/login", userController.userLogin);
router.get("/emailVerify/:token", userController.emailVerify );
router.post("/forgotpassword", userController.forgotPassword );
router.post("/resetpassword",  userController.resetPassword );

router.use(auth);
router.get("/viewprofile",  userController.viewUserProfile );
router.delete("/userDeleted", userController.deleteUser)



module.exports = router;
