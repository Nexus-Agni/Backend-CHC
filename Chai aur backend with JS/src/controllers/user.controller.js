import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getRefreshAndAccessToken = async (userId)=> {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
    
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        throw new ApiError(500, "Something went wrong during generating access and refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res)=>{
    //steps 
    // Take user data like username, email from frontend
    // Validate the inputs
    // check if user already exists
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - store it in mongodb
    // remove password and refresh token field from the resoponse
    // if response exists return res

    const {username, fullname, email, password} = req.body
    
    //checking for empty inputs
    if (username === " ") {
        throw new ApiError(500, "Username is required")
    } 
    if (fullname === " ") {
        throw new ApiError(500, "Fullname is required")
    }
    if (email === " ") {
        throw new ApiError(500, "Email is required")
    }
    if (password === " ") {
        throw new ApiError(500, "Password is required")
    }

    //checking for valid email adress
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(500, "Invalid email address");
    }

    // checking for valid password
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/gm
    if (!passwordRegex.test(password)) {
        throw new ApiError(500, "Password should contain Uppercase, lowercase, numbers, special charecterrs and should be at least 8 char long")
    }

    //checking if user already exists
    const existedUser = await User.findOne({
        $or : [{email}, {username}]
    })
    if (existedUser) {
        throw new ApiError(509, "User already exists")
    }

    //
    // const avatarLocalPath =  req.files?.avatar[0].path;
    // // const coverImageLocalPath = req.files?.coverImage[0].path;
    // console.log(req.files);
    // console.log(avatarLocalPath);
    let avatarLocalPath;
    if (req.files && req.files.avatar && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage.files
    }

    // let coverImageLocalPath;
    //     if (req.files && req.files.coverImage && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    //     coverImageLocalPath = req.files.coverImage[0].path;
    // }   


    if (!avatarLocalPath) {
        throw new ApiError(500, "Avatar is required")
    }

    //upload on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(500, "Avatar is required")
    }

    //Creating a user
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || " ",
        username : username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findOne(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )
})

const loginUser = asyncHandler(async (req, res)=>{
    // take data from res.body
    // take username or email from the user
    // check whether user is present or not
    // if not present -> throw error
    // if present -> take input for password
    // check the password
    // if incorrect -> throw error
    // if correct -> generate and send request and access token via cookies

    const {username, password, email} = res.body

    if (!username || !email) {
        throw new ApiError(500, "Either username or password is required")
    }

    const user = await User.findOne({
        $or : [{username, email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid login credentials")
    }

    const {accessToken , refreshToken } = await getRefreshAndAccessToken(user._id)

    const loggedInUser = User.findById(_id).select("-password -refreshToken ")
    
    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("refresh token", refreshToken, options)
    .cookie("access token", accessToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "Successfully logged In "
        )
    )

})

export {
    registerUser,
    loginUser
}