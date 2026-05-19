import {Router} from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { vendorAuth } from '../../middleware/vendor.middleware.js';
import  * as VendorController from './vendor.controller.js';
import { createLimiter } from '../../middleware/ratelimit.middleware.js';
import { vendorInputValidation } from './vendor.validator.js';

const vendorRouter = Router();

vendorRouter.post(
    '/onboard',
    createLimiter(1,5),
    vendorInputValidation,
    requireAuth,
    VendorController.vendorOnBoardController
);

vendorRouter.use(vendorAuth);
vendorRouter.get(
    '/profile',
    createLimiter(1,60),
    VendorController.vendorProfileController 
);

vendorRouter.get(
    '/cars',
    createLimiter(1,60),
    VendorController.vendorCarController
);

vendorRouter.get(
    '/bookings',
    createLimiter(1,60),
    VendorController.vendorBookingController
);

vendorRouter.get(
    '/revenue',
    createLimiter(1,30),
    VendorController.vendorRevenueController
)

export default vendorRouter;