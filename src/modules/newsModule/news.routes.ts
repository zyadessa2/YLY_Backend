import { Router } from 'express';
import { NewsController } from './news.controller';
import { 
    createNewsSchema, 
    updateNewsSchema, 
    newsIdParamSchema,
    getNewsQuerySchema
} from './news.validation';
import validation from '../../middleware/validation.middleware';
import { authenticate, authorize, optionalAuthenticate } from '../../middleware/auth.middelware';

const router = Router();
const newsController = new NewsController();

// Public routes
router.get('/slug/:slug', newsController.getNewsBySlug);
router.get('/featured', newsController.getFeaturedNews);
router.patch('/:id/view', validation({ params: newsIdParamSchema }), newsController.incrementViewCount);

// Statistics (Admin only)
router.get('/stats', authenticate(), authorize(['admin']), newsController.getNewsStats);

// Related news
router.get('/:id/related', validation({ params: newsIdParamSchema }), newsController.getRelatedNews);

// CRUD operations
router.post('/', 
    authenticate(), 
    authorize(['admin', 'governorate_user']),
    validation({ body: createNewsSchema }), 
    newsController.createNews
);

router.get('/', 
    optionalAuthenticate(), // Can be accessed with or without auth
    validation({ query: getNewsQuerySchema }), 
    newsController.getAllNews
);

router.get('/:id', 
    validation({ params: newsIdParamSchema }), 
    newsController.getNewsById
);

router.patch('/:id', 
    authenticate(), 
    authorize(['admin', 'governorate_user']),
    validation({ params: newsIdParamSchema, body: updateNewsSchema }), 
    newsController.updateNews
);

router.delete('/:id', 
    authenticate(), 
    authorize(['admin', 'governorate_user']),
    validation({ params: newsIdParamSchema }), 
    newsController.deleteNews
);

// Admin-only operations
router.patch('/:id/toggle-featured', 
    authenticate(), 
    authorize(['admin']),
    validation({ params: newsIdParamSchema }), 
    newsController.toggleFeatured
);

router.patch('/:id/toggle-published', 
    authenticate(), 
    authorize(['admin']),
    validation({ params: newsIdParamSchema }), 
    newsController.togglePublished
);

export default router;
