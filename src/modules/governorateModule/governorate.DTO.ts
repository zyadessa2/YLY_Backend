import {z} from 'zod';
import { createGovernorateSchema, getGovernoratesQuerySchema, governorateIdParamSchema, governorateSlugParamSchema, updateGovernorateSchema } from './governorate.validation.js';

export type createGovernorateDTO = z.infer<typeof createGovernorateSchema>;
export type updateGovernorateDTO = z.infer<typeof updateGovernorateSchema>;
export type governorateIdParamDTO = z.infer<typeof governorateIdParamSchema>;
export type governorateSlugParamDTO = z.infer<typeof governorateSlugParamSchema>;
export type getGovernoratesQueryDTO = z.infer<typeof getGovernoratesQuerySchema>;
