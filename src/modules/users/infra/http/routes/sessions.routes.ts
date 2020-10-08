import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionController from '../controllers/SessionsController';

const sessionsRouter = Router();
const sessionController = new SessionController();

// POST http://localhost:3333/appointments
sessionsRouter.post('/', celebrate({ [Segments.BODY]: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
} }) ,sessionController.create);

export default sessionsRouter;