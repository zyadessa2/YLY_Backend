import { Router } from 'express';
import { GovernorateController } from './governorate.controller.js';
import { 
    createGovernorateSchema, 
    updateGovernorateSchema, 
    governorateIdParamSchema,
    governorateSlugParamSchema,
    getGovernoratesQuerySchema
} from './governorate.validation.js';
import validation from '../../middleware/validation.middleware.js';
import { authenticate, authorize } from '../../middleware/auth.middelware.js';

const router = Router();
const governorateController = new GovernorateController();

// Public routes
router.get('/all', governorateController.getAllGovernoratesNoPagination);
router.get('/slug/:slug', 
    validation({ params: governorateSlugParamSchema }), 
    governorateController.getGovernorateBySlug
);

// Governorate content (public)
router.get('/:id/news', 
    validation({ params: governorateIdParamSchema }), 
    governorateController.getGovernorateNews
);
router.get('/:id/events', 
    validation({ params: governorateIdParamSchema }), 
    governorateController.getGovernorateEvents
);
router.get('/:id/stats', 
    validation({ params: governorateIdParamSchema }), 
    governorateController.getGovernorateStats
);

// Statistics (Admin only)
router.get('/stats/all', 
    authenticate(), 
    authorize(['admin']), 
    governorateController.getGovernoratesWithStats
);

// CRUD operations (Admin only)
router.post('/', 
    authenticate(), 
    authorize(['admin']),
    validation({ body: createGovernorateSchema }), 
    governorateController.createGovernorate
);

router.get('/', 
    validation({ query: getGovernoratesQuerySchema }), 
    governorateController.getAllGovernorates
);

router.get('/:id', 
    validation({ params: governorateIdParamSchema }), 
    governorateController.getGovernorateById
);

router.get('/:id/details', 
    validation({ params: governorateIdParamSchema }), 
    governorateController.getGovernorateDetails
);

router.patch('/:id', 
    authenticate(), 
    authorize(['admin']),
    validation({ params: governorateIdParamSchema, body: updateGovernorateSchema }), 
    governorateController.updateGovernorate
);

router.delete('/:id', 
    authenticate(), 
    authorize(['admin']),
    validation({ params: governorateIdParamSchema }), 
    governorateController.deleteGovernorate
);

export default router;
