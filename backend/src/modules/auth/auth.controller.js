const AuthModel = require("../../models/auth.model");
const OtpModel = require("../../models/otp.model");
const jwt = require("jsonwebtoken");

async function sendOtp(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Phone number required",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.findOneAndUpdate(
      { phone },
      { otp, expires_at: expiry },
      { upsert: true },
    );

    console.log("OTP:", otp); // testing

    res.status(200).json({
      message: "OTP sent successfully",
      otp : otp
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function userRegister(req, res) {
  try {
    const { username, phone, otp, role } = req.body;

    if (!username || !phone || !otp || !role) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // Only allow user or worker
    if (!["user", "worker"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const otpDoc = await OtpModel.findOne({ phone });

    if (!otpDoc || String(otpDoc.otp) !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (otpDoc.expires_at < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const existingUser = await AuthModel.findOne({ phone });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = await AuthModel.create({
      username,
      phone,
      role,
    });

    await OtpModel.deleteOne({ phone });

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token : token
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function userLogin(req, res) {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const otpDoc = await OtpModel.findOne({ phone });

    if (!otpDoc || otpDoc.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (otpDoc.expires_at < new Date()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const user = await AuthModel.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not registered",
      });
    }

    await OtpModel.deleteOne({ phone });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );
    
    res.cookie("token", token);
    
    res.status(200).json({
      message: "User Logged In Successfully",
      user,
      token : token
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function userLogout(req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "User Looged Out Successfully",
  });
}
module.exports = { sendOtp, userRegister, userLogin, userLogout };
