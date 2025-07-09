import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({
      email,
    });

    if (user) return res.status(400).json({ message: "User aldreasy exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({ userId: newUser._id });

    await profile.save();

    return res.json({ message: "User Created" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({
      email,
    });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });
    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename;
    await user.save();
    return res.json({ message: "Profile picture updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(404).json({ message: "User alrdeady exist" });
      }
    }
    Object.assign(user, newUserData);

    await user.save();

    return res.json({ message: "User updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

 export const getUserAndProfile = async (req, res) => {
  try {
    // 1. Properly extract token from request body
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // 2. Find user with await
    const user = await User.findOne({ token });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Find profile - adjust based on your schema
    const profile = await Profile.findOne({ userId: user._id });
    
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // 4. Return combined data
    return res.json({
      profile: profile
    });

  } catch (error) {
    console.error("Error in getUserAndProfile:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

export const updateProfileDate = async(req,res) => {
  try {

    const {token , ...newProfileData} = req.body;
    const userProfile = await User.findOne({ token: token})

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }
    const profile_to_update = await Profile.findOne({ userId: userProfile._id})

    Object.assign(profile_to_update, newProfileData)
    await profile_to_update.save();

    return res.json({ message: "Profile updated"})


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const getAllUserProfile = async(req, res) => {
  try {
    const profiles = await Profile.find().populate('userId', 'name username, email profilePicture')

    return res.json({profiles})

  } 
  catch (error) {
    return res.status(500).json({ message: error.message });
  }
}