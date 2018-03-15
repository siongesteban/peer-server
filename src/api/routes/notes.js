import { Router } from 'express';

import {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notes';

const api = Router();

api.get('/', getNotes);
api.get('/:id', getNote);
api.post('/', createNote);
api.patch('/:id', updateNote);
api.delete('/:id', deleteNote);

export default api;