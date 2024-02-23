// class ApiError extends Error {
//     constructor(
//         stausCode,
//         message = "Something went Wrong",
//         errors = [],
//         stack = ""
//     ){
//         this.stausCode = stausCode
//         this.message = message
//         this.errors = errors
        
//         if (stack) {
//             this.stack = stack
//         } else {
//             Error.captureStackTrace(this, this.constructor)
//         }
//     }
// }

// export {ApiError}

class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went Wrong",
        errors = [],
        stack = ""
    ){
        super(message); // Call the super class constructor and pass in the message parameter

        this.statusCode = statusCode;
        this.errors = errors;
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError}