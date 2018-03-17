import { Router } from 'express';

import {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '../controllers/schedules';

const api = Router();

api.get('/', getSchedules);
api.get('/:id', getSchedule);
api.post('/', createSchedule);
api.patch('/:id', updateSchedule);
api.delete('/:id', deleteSchedule);

export default api;