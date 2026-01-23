import { compare, genSalt, hash } from "bcrypt"


export const generateHash = async (plainText : string , saltRound : number = Number(process.env.SALT)): Promise<string> =>{
    const salt:string = await genSalt(saltRound);
    return await hash(plainText, salt);
}

export const compareHash = async (plainText : string , hash :string): Promise<boolean> =>{
    return await compare(plainText, hash);
}