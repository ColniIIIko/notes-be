import NoteModel from '@/resources/note/note.model';
import Note from '@/resources/note/note.interface';

export default class NoteService {
  private note = NoteModel;

  public async create(title: string, body: string, userId: string): Promise<Note> {
    try {
      const note = await this.note.create({ title, body, userId });
      return note;
    } catch (e) {
      throw new Error('Unable to create note');
    }
  }

  public async get(noteId: string) {
    try {
      const note = await this.note.findById(noteId);
      return note;
    } catch (e) {
      throw new Error('Cannot find note');
    }
  }

  public async getAll(userId: string) {
    try {
      const notes = await this.note.find({ userId });
      return notes;
    } catch (e) {
      throw new Error('Cannot find notes');
    }
  }

  public async update(title: string, body: string, noteId: string) {
    try {
      const note = await this.note.findByIdAndUpdate(
        noteId,
        { title, body },
        { returnDocument: 'after' }
      );
      return note;
    } catch (e) {
      throw new Error('Failed at note updating');
    }
  }

  public async delete(noteId: string) {
    try {
      const note = await this.note.findByIdAndDelete(noteId);
      return note;
    } catch (e) {
      throw new Error('Failed at note deleting');
    }
  }
}
