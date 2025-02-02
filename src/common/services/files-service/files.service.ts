import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
    async deleteLocalFile(filePath: string) {
        try {
          if (fs.existsSync(filePath)) {
            // file exists, delete it
    
            fs.unlinkSync(filePath);
            console.log('Image File deleted');
          } else {
            console.log(`File does not exist: ${filePath}`);
          }
        } catch (err) {
          console.error(`Error deleting image file: ${err.message}`);
        }
      }
    
      async updateFile(
        id: string,
        filePropertyName: string,
        newFilePath: string,
        repository: Repository<any>,
      ) {
        const entity = await repository.findOne({ where: { id } });
    
        if (!entity) {
          throw new NotFoundException(`Entity with ID ${id} not found`);
        }
        const oldFile = entity[filePropertyName];
    
        await repository.update(id, { [filePropertyName]: newFilePath });
    
        if (oldFile) {
          const oldFilePath = path.join(process.cwd(), oldFile);
          try {
            await this.deleteLocalFile(oldFilePath);
          } catch (err) {
            console.error(
              `Failed to delete old ${filePropertyName} file ${oldFile}: ${err}`,
            );
          }
        }
      }
}
