const User = require("../models/user.model");
const sendEmail = require("../utils/email");
const crypto = require("crypto");
const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const Token = require("../models/token.model");


exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;
    // validate the password to include all characters
    if (!password.match(/\d/) || !password.match(/[a-zA-Z]/)) {
        return res.status(400).json({
        message: 'Password must contain at least one capital letter and one number'
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const existingUser = await User.findOne({ email });
    if(existingUser) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }
    const newUser = await User.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashedPassword,
    });
    const jwtoken = crypto.randomBytes(16).toString('hex');
    const token = await Token.create({
      token: jwtoken,
      userId: newUser._id
    });
    await sendEmail({
      email: newUser.email,
      subject: 'Welcome to the Oneport365 app',
      message: `Hi ${newUser.firstName} ${newUser.lastName},
                     Please, Kindly click on the link to verify your email,
                     <a href="${process.env.VERIFY_EMAIL}/emailVerify/${token.token}">Verify your Email Here </a>`
    });
    return res.status(201).json({
      message: 'User created',
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
}

// to verify student/user email
exports.emailVerify = async(req, res) => {
    try {
        const token = req.params.token
        const user = await Token.findOne({ token });
        if (!user) {
            return res.status(400).json({
                message: 'Token not found'
            });
        };
        const isMatch = await User.findOne({ _id: user.userId });
        if(isMatch.isEmailActive === true) {
            return res.status(400).json({
                message: 'Your account is already verified'
            });
        };
        const existingUser = await User.findOneAndUpdate(
            { _id: isMatch._id}, 
            { isEmailActive: true }, 
            { new: true }
        );
        await sendEmail({
            email: existingUser.email,
            subject: 'You have been verified',
            message: `
                <p>Hi ${existingUser.firstName},</p>
                <p> Your Account has been verified. Below are your details</p>
                <p>  ${existingUser.firstName} </p>
                <P> ${existingUser.email } </a><br><br><br>
                <p>Thanks,</p>
                <p>Team ${process.env.APP_NAME}</p>
            `
        });
        return res.status(200).json({
            message: 'User verified successfully',
            existingUser
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error while verifying user',
            error: error.message
        });
    }
};



// user login

exports.userLogin = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        };
        // verify password by bcrypt 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Incorrect username or password'
            });
        };
        const isActive = await User.findOne({ _id: user._id });
        if (isActive.isEmailActive === false) {
            return res.status(400).json({
                message: 'Your account is pending. kindly check your email inbox and verify it'
            });
        };
        const token = jwt.sign({
             _id: user._id,
            }, process.env.JWT_SECRET, { expiresIn: '24h' });
            
        return res.status(200).json({
            message: 'User logged in successfully',
            token,
            user
        });
    } catch (error) {
        res.status(400).json({
            message: 'Error while logging in',
            error: error.message
        });
    }
};

// Student view his profile

exports.viewUserProfile = async(req, res) => {
    try {        
        const id= req.user;
        const existingUser = await User.findById(id);
        const userStatus = await User.findById(existingUser._id);
        if (userStatus.roles === 'student') {
        const user = await User.findOne({ _id: userStatus._id });
        if (!user) {
            return res.status(400).json({
                message: 'User not found'
            });
        };
        return res.status(200).json({
            message: 'User profile',
            user
        });
      }else{
        return res.status(400).json({
            message: 'You must be registered student to view your profile',
        });
      }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while viewing user',
            error: error.message
        });
    }
};




// forgot password

exports.forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          const tokens = crypto.randomBytes(3).toString('hex');
          const token = await Token.create({          
             token: tokens,
             userId: existingUser._id,
        });
        await sendEmail({
            email: existingUser.email,
            subject: 'Reset your password',
            message: `
                <p>Hi ${existingUser.firstName},</p>
                <p> You have requested to reset your password. Below are your details</p>
                <p>  ${existingUser.firstName} </p>
                <p> ${existingUser.email} </a><br><br><br>
                <p> Your password reset token is ${tokens} </p><br><br>
                <a href="${process.env.CLIENT_URL}/resetpassword?=${token.token}">Reset Password</a>
                <p>Thanks,</p>
                <p>Team ${process.env.APP_NAME}</p>`
        });
        return res.status(200).json({
            message: 'Password reset link sent to your email',
            token
        });
      }else{
        return res.status(400).json({
            message: 'User with this email, not found'
        });
      }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while sending password reset link',
            error: error.message
        });
    }
};


// reset password

exports.resetPassword = async(req, res) => {
    try {
        const { token, password } = req.body;
        const user = await Token.findOne({ token });
        if (user) {
            // hashed the password 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
        const updatedUser = await User.findOneAndUpdate({_id: user.userId }, {
            password: hashedPassword,
        }, { new: true });
        return res.status(200).json({
            message: 'Password reset successfully',
            updatedUser
        });
      }else{
        return res.status(400).json({
            message: 'Token not valid'
        });
      }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while resetting password',
            error: error.message
        });
    }
};

// delete user

exports.deleteUser = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
              message: "user not found"
            })
          }
        await User.findByIdAndDelete(user._id);
        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(400).json({
            message: 'Error while deleting user',
            error: error.message
        });
    }
};


// user logout

exports.logout = async(req, res) => {
    try {
        const { token } = req.body;
        const user = await Token.findOne({ token });
        if (user) {
            await Token.findByIdAndDelete(user._id);
            return res.status(200).json({
                message: 'User logged out successfully'
            });
        } else {
            return res.status(400).json({
                message: 'Token not valid',
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'Error while logging out',
            error: error.message
        });
    }
};

