import * as s3Controller from '@/controllers/v1/s3.controller';
import {
  deleteFilesValidator,
  publicUploadValidator,
  secureUploadValidator
} from '@/validators/s3.validator';
import { Router } from 'express';

const s3Routes = Router();

/*-----------Upload Documents/Files Securely--------------*/
s3Routes.post(
  '/protected-upload',
  secureUploadValidator,
  s3Controller.protectedUpload
);

/*-----------Upload Images Publicly--------------*/
s3Routes.post(
  '/public-upload',
  publicUploadValidator,
  s3Controller.publicUpload
);

/*-----------Get File Access URL--------------*/
s3Routes.get(
  '/file-url/:key',
  s3Controller.getFileUrl
);

/*-----------Delete Files--------------*/
s3Routes.delete(
  '/files',
  deleteFilesValidator,
  s3Controller.deleteFiles
);

export default s3Routes;
