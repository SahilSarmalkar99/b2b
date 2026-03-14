const jwt = require("jsonwebtoken");

async function adminAuth(req , res , next){

    try{

        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({message : "unauthorized"});
        }

        const decoded = jwt.verify(token , process.env.SECRET_KEY);

        if(decoded.role !== "admin"){
            return res.status(403).json({message : "Forbidden"});
        }

        next()

    } catch(error){
        res.status(401).json({message : "Unauthorized"});
    }
}

module.exports = { adminAuth };