import {z} from "zod";
import { createUserSchema, resetPasswordSchema, updateUserSchema, userIdParamSchema } from "./user.validation";


export type createUserDTO = z.infer<typeof createUserSchema>;
export type updateUserDTO = z.infer<typeof updateUserSchema>;
export type userIdParamDTO = z.infer<typeof userIdParamSchema>;
export type resetPasswordDTO = z.infer<typeof resetPasswordSchema>;
