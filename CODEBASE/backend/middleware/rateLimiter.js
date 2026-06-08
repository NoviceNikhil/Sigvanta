const rateLimit = require("express-rate-limit");
const AppError = require("../utils/AppError");

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,//15 minutes,60 seconds.1000 milliseconds
    max: 25,//max number of requests
    standardHeaders: true,
    legacyHeaders: false,//made use of by hackers since it is not updated with latest security

    handler: (req,res,next) => {
        return next(new AppError("Too many requests, please try again later"),429);
    }//429 for too many requests
});
module.exports = apiLimiter;