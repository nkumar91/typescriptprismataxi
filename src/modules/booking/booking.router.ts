import {Router} from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { createLimiter } from '../../middleware/ratelimit.middleware.js';
import * as BookingController from './booking.controller.js';
import { 
    cancelValidation,
    createBookingValidation ,
    paramsValidation,
    paramsWithDateValidation,
} from './booking.validator.js';

const bookingsRouter = Router();


bookingsRouter.use(requireAuth);
bookingsRouter.post(
    "/",
    createBookingValidation,
    createLimiter(1, 30),
    BookingController.createNewBooking
);
bookingsRouter.get(
    "/:id",
    paramsValidation,
    createLimiter(1, 60),
    BookingController.getBookingDetailsById
);
bookingsRouter.patch(
    "/:id/cancel",
    cancelValidation,
    createLimiter(1, 10),
    BookingController.cancelBooking
);
bookingsRouter.get(
    "/check-availability",
    createLimiter(1, 60),
);
bookingsRouter.patch(
    "/:id/extend",
    paramsWithDateValidation,
    createLimiter(1, 10),
    BookingController.extendsBookingController
);

export default bookingsRouter;