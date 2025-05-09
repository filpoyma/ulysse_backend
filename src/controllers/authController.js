import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import config from "../config/config.js";

const cookieOption = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? "none" : "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
console.log("file-authController.js cookieOption:", cookieOption);

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });

  return { accessToken, refreshToken };
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, cookieOption);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      },
    });
  } else {
    throw new ApiError(400, "Invalid user data");
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, cookieOption);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        accessToken,
      },
    });
  } else {
    throw new ApiError(401, "Invalid email or password");
  }
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("file-authController.js refreshToken:", refreshToken);

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required2");
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwtSecret);
    console.log(
      "file-authController.js decoded.id:>>>>>>>>>>>>>>>>>>>>>>>>>>",
      decoded.id
    );
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    const tokens = generateTokens(user._id);
    console.log(
      "file-authController.js tokens.refreshToken:",
      tokens.refreshToken
    );

    // Set new refresh token in HTTP-only cookie
    res.cookie("refreshToken", tokens.refreshToken, cookieOption);

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error("file-authController.js error:", error.message);
    throw new ApiError(401, error.message);
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).lean();
  if (user) {
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    throw new ApiError(404, "User not found");
  }
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const { accessToken, refreshToken } = generateTokens(updatedUser._id);

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, cookieOption);

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        accessToken,
      },
    });
  } else {
    throw new ApiError(404, "User not found");
  }
});
