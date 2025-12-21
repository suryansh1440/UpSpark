import { generateToken } from "../lib/utils.js";
import User from "../modals/user.modal.js";
import bcrypt from "bcryptjs";



export const signup = async(req,res)=>{

    const {name,email,password,role} = req.body;
    try{
        if(!name || !email || !password || !role){
            return res.status(400).json({message:"All fields are required"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists with this email"});
        }

        const roleOptions = ["founder","investor","collaborator"];
        if(!roleOptions.includes(role)){
            return res.status(400).json({message:"Invalid role selected"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            roles:[role],
            activeRole:role,
        });
        await newUser.save();

        generateToken(newUser._id, res);

        // Sanitize user object before sending (remove password)
        const userToReturn = newUser.toObject();
        delete userToReturn.password;

        return res.status(201).json({ user: userToReturn, message: "User registered successfully" });
    }catch(error){
        console.error("Signup error:",error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const login = async (req, res) => {
    const {email,password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"});
        }

        const normalizedEmail = String(email).toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: 'User is blocked' });
        }
        if (!user.password) {
            console.error('Login error: user has no password stored:', user._id);
            return res.status(500).json({ message: 'Unable to verify credentials' });
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res);

        const userToReturn = user.toObject();
        delete userToReturn.password;

        return res.status(200).json({user : userToReturn ,message:"Login successful"});
    }catch(error){
        console.log("Login error:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie("jwt",{
            httpOnly:true,
            secure:true,
            sameSite:"none",
        });
        return res.status(200).json({message:"Logged out successfully"});
    }catch(error){
        console.log("Logout error:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}   

export const checkAuth = async (req, res) => {
    try{
        if (!req.user) return res.status(200).json(null);
        const user = req.user.toObject ? req.user.toObject() : { ...req.user };
        delete user.password;
        return res.status(200).json(user);
    }catch(error){
        console.log("Check auth error:", error);
    }
}

export const changeRole = async(req,res)=>{
    const {role} = req.body;
    const user = req.user;
    const validRoles = ["founder", "investor", "collaborator", "admin"];
    try{
        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!Array.isArray(user.roles) || !user.roles.includes(role)) {
            return res.status(403).json({ message: "User does not have this role" });
        }

        user.activeRole = role;
        await user.save();

        const userToReturn = user.toObject ? user.toObject() : { ...user };
        delete userToReturn.password;
        return res.status(200).json({ user: userToReturn, message: "Role changed successfully" });
        
    }catch(error){
        console.log("Change role error:", error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const addRole = async(req,res)=>{
    const {role} = req.body;
    const user = req.user;
    const validRoles = ["founder", "investor", "collaborator"];
    try{
        if (!role || !validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (Array.isArray(user.roles) && user.roles.includes(role)) {
            return res.status(409).json({ message: "User already has this role" });
        }

        // ensure roles is an array
        user.roles = Array.isArray(user.roles) ? user.roles : [];
        user.roles.push(role);
        user.activeRole = role;
        await user.save();

        const userToReturn = user.toObject ? user.toObject() : { ...user };
        delete userToReturn.password;
        return res.status(200).json({ user: userToReturn, message: "Role added successfully" });

    }catch(error){
        console.log("Add Role error : ",error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
