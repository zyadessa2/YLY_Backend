import z from 'zod';
export declare const loginSchema: {
    body: z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strict>;
};
export declare const refreshTokenSchema: {
    headers: z.ZodPipe<z.ZodObject<{
        authorization: z.ZodString;
    }, z.core.$strip>, z.ZodTransform<{
        refreshToken: string;
    }, {
        authorization: string;
    }>>;
};
//# sourceMappingURL=auth.validation.d.ts.map