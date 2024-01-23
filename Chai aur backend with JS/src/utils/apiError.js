class ApiError extends Error {
    constructor(
        stausCode,
        message = "Something went Wrong",
        errors = [],
        stack = ""
    ){
        this.stausCode = stausCode
        this.message = message
        this.errors = errors
        
        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}