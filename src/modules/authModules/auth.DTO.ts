import z from 'zod';
import * as validation from './auth.validation.js';

// i make this DTO to make type of signUpSchema and use the type of signUpSchema in other files
export type loginDTO = z.infer<typeof validation.loginSchema.body>; 

export type refreshTokenDTO = z.infer<typeof validation.refreshTokenSchema>;
