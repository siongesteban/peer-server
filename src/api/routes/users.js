import { Router } from 'express';

import {
  getUsers,
  updateUser,
} from '../controllers/users';

const api = Router();

api.get('/', getUsers);
api.patch('/:id', updateUser);

export default api;