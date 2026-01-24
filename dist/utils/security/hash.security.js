import { compare, genSalt, hash } from "bcrypt";
export const generateHash = async (plainText, saltRound = Number(process.env.SALT)) => {
    const salt = await genSalt(saltRound);
    return await hash(plainText, salt);
};
export const compareHash = async (plainText, hash) => {
    return await compare(plainText, hash);
};
//# sourceMappingURL=hash.security.js.map