import { Router, Response, Request, NextFunction, response } from 'express';

import Controller from '@/utils/interfaces/controller.interface';
import HttpException from '@/utils/exceptions/http.exception';
import ValidationMiddleware from '@/middleware/validation.middleware';
import validate from '@/resources/note/note.validation';
import NoteService from '@/resources/note/note.service';

export default class NoteController implements Controller {
  public path = '/notes';
  public router = Router();
  private noteService = new NoteService();

  constructor() {
    this.initialiseRoutes();
  }

  private initialiseRoutes() {
    this.router.get('/', this.getAllNotes);
    this.router.get('/:noteId', this.getNote);
    this.router.put('/:noteId', ValidationMiddleware(validate.update), this.updateNote);
    this.router.delete('/:noteId', this.deleteNote);
    this.router.post('/', ValidationMiddleware(validate.create), this.create);
  }

  private create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { title, body } = req.body;
      const note = await this.noteService.create(title, body, req.user._id);
      res.status(201).json({ note });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private getNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const note = await this.noteService.get(req.params.noteId);
      res.status(200).json({ note });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notes = await this.noteService.getAll(req.user._id);
      res.status(200).json({ notes });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, body } = req.body;
      const note = await this.noteService.update(title, body, req.params.noteId);
      res.status(200).json({ note });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };

  private deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const note = await this.noteService.delete(req.params.noteId);
      res.status(200).json({ message: 'Successfully' });
    } catch (e: any) {
      next(new HttpException(400, e.message));
    }
  };
}
