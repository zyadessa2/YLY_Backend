import { z } from 'zod';
import { createEventSchema, eventIdParamSchema, eventRegistrationSchema, getEventsQuerySchema, updateEventSchema, updateRegistrationStatusSchema } from './event.validation.js';
export type createEventDTO = z.infer<typeof createEventSchema>;
export type updateEventDTO = z.infer<typeof updateEventSchema>;
export type eventIdParamDTO = z.infer<typeof eventIdParamSchema>;
export type getEventsQueryDTO = z.infer<typeof getEventsQuerySchema>;
export type eventRegistrationDTO = z.infer<typeof eventRegistrationSchema>;
export type updateRegistrationStatusDTO = z.infer<typeof updateRegistrationStatusSchema>;
//# sourceMappingURL=event.DTO.d.ts.map