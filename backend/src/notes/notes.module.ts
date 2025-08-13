import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { VectorsModule } from '../vectors/vectors.module';
import { NotesController } from './notes.controller';

@Module({
  imports: [VectorsModule],
  controllers: [NotesController],
  providers: [NotesService],
  exports: [NotesService],
})
export class NotesModule {}
