import { Router } from 'express';

import {
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointments';

const api = Router();

api.post('/', createAppointment);
api.patch('/:id', updateAppointment);
api.delete('/:id', deleteAppointment);

export default api;