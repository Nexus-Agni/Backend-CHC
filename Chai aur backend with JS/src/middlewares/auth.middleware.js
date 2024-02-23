import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { jwt } from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next)=> {
try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ", "")
    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decoded?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }
    
        req.user = user
        next()
} catch (error) {
    throw new ApiError(500, error?.message || "Invalid access token")
}
})