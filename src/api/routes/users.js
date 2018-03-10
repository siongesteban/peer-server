import { Router } from 'express';

import {
  updateUser
} from '../controllers/users';

const api = Router();

api.patch('/:id', updateUser);

export default api;