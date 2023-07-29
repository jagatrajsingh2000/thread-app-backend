import { createHmac, randomBytes } from "crypto"
import PrismaClient from "../lib/db";
import JWT from "jsonwebtoken";
const JWT_SECRET = "$uperM@n@123";

export interface createUserPayload {
    firstName: string,
    lastName?: string,
    email: string,
    password: string
}
export interface getUserTokenPayload{
    email: string,
    password: string
}

class UserService {
    private static genarateHash(salt: string,password: string){
        const hashedPassword = createHmac("sha256", salt)
        .update(password)
        .digest('hex')
        return hashedPassword
    }
    public static async createUser(payload:createUserPayload){
        const {firstName, lastName, email, password} = payload
        const salt = randomBytes(32).toString();
        const hashedPassword = UserService.genarateHash( salt, password)
        

        return PrismaClient.user.create({
            data:{
                firstName,
                lastName,
                email,
                password:hashedPassword,
                salt
            }
        })
    }
    private static async getUserByEmail(email: string){
        return PrismaClient.user.findUnique({where: {email}})
    }
    public static async getUserToken(payload:getUserTokenPayload){
        const {email, password} = payload;
        const user = await UserService.getUserByEmail(email);
        if(!user){
            throw new Error ("User not found with this mail")
        }
        const userSalt = user.salt;
        const hashedPassword = await UserService.genarateHash( userSalt, password)
        if(user.password !== hashedPassword){
            throw new Error ("Password does not match")
        }
        const token = JWT.sign({id:user.id, email: user.email},JWT_SECRET)
        return token
    }
    public static getUserById(id:string) {
        return PrismaClient.user.findUnique({where: {id}})
    }
    public static decodeJWTToken(token: string) {
        return JWT.verify(token, JWT_SECRET);
      }
}
export default UserService