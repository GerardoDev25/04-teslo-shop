import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileFilter } from './helpers/filefilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  finsProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.status(200).sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,

      // limits: { fileSize: 1000 },
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadedProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is empty');
    }

    const secureUrl = `${file.filename}`;

    return { filename: file.filename };
  }
}
