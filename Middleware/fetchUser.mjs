import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv' 
dotenv.config()
const jwt_key = process.env.JWT_KEY;

const fetchUser = (req,res,next)=>{
    const token = req.header('auth-token')
    if(!token){
        return res.status(401).send("Please authenticate with valid auth-token")
    }
    
    try {
        const data = jwt.verify(token, jwt_key);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send("Please authenticate with valid auth-token")
    }
}
export default fetchUser;