import aj from '../config/arcjet.js';

const arcjetMiddleware = async (req,res,next)=>{
    try{
        const decision = await aj.protect(req,{requested:1});

        if(decision.isDenied()){
            if(decision.reason.isBot()){ 
                res.status(403).json({
                success:false,
                message:"Access denied for bots"
                })
            }
            if(decision.reason.isRateLimit){
                res.status(429).json({
                    success:false,
                    message:"Too many requests, please try again later"
                })
            }

            return res.status(403).send("Access denied");
        }

        next();
    }catch(error){
        console.error("Arcjet middleware error:", error);
        next(error);
    }
}

export default arcjetMiddleware;