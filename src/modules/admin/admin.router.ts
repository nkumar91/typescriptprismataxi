import {Router} from 'express';
import { requireAdminAuth } from '../../middleware/admin.middleware.js';
import { createLimiter } from '../../middleware/ratelimit.middleware.js';
const adminRouter = Router();

// All admin routes will be defined here
adminRouter.use(requireAdminAuth);

adminRouter.get(
    '/dashboard',
    createLimiter(1,60)
);
adminRouter.get(
    '/users',
    createLimiter(1,60)
);
adminRouter.get(
    '/users/:id',
    createLimiter(1,60)
);
adminRouter.patch(
    '/users/:id/suspend',
    createLimiter(1,10)
);
adminRouter.get(
    '/kyc/pending',
    createLimiter(1,60)
);
adminRouter.patch(
    '/kyc/:id/approve',
    createLimiter(1,10)
);
adminRouter.patch(
    '/kyc/:id/reject',
    createLimiter(1,10)
);
adminRouter.get(
    '/bookings',
    createLimiter(1,60)
);
adminRouter.patch(
    '/bookings/:id/status',
    createLimiter(1,10)
);
adminRouter.get(
    '/cars',
    createLimiter(1,60)
);
adminRouter.get(
    '/analytics/revenue',
    createLimiter(1,30)
);
adminRouter.get(
    '/analytics/bookings',
    createLimiter(1,30)
);
adminRouter.get(
    '/vendors',
    createLimiter(1,60)
);
adminRouter.patch(
    '/vendors/:id/approve',
    createLimiter(1,10)
);


export default adminRouter;