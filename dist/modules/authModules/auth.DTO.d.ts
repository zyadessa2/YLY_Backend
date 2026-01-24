import z from "zod";
import * as validation from "./auth.validation";
export type loginDTO = z.infer<typeof validation.loginSchema.body>;
export type refreshTokenDTO = z.infer<typeof validation.refreshTokenSchema>;
//# sourceMappingURL=auth.DTO.d.ts.map