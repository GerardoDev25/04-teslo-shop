import { v4 as UUID } from 'uuid';
/* eslint-disable @typescript-eslint/ban-types */
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${UUID()}.${fileExtension}`;

  callback(null, fileName);
};
