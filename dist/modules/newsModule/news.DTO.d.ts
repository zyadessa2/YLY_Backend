import { z } from 'zod';
import { createNewsSchema, getNewsQuerySchema, newsIdParamSchema, updateNewsSchema } from './news.validation.js';
export type createNewsDTO = z.infer<typeof createNewsSchema>;
export type updateNewsDTO = z.infer<typeof updateNewsSchema>;
export type newsIdParamDTO = z.infer<typeof newsIdParamSchema>;
export type getNewsQueryDTO = z.infer<typeof getNewsQuerySchema>;
//# sourceMappingURL=news.DTO.d.ts.map