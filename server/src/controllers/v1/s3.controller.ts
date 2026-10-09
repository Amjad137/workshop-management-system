import BadRequestException from '@/exceptions/bad-request.exception';
import s3Utils, { IUploadRequestData } from '@/utils/s3.utils';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

/*-----------Upload Documents/Files Securely--------------*/
export const protectedUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileType, folder, keyCount = 1, oldKeys } = req.getValid
      ? req.getValid<IUploadRequestData>('json')
      : (req.body as unknown as IUploadRequestData);

    if (!s3Utils.validateImageType(fileType) && !s3Utils.validateDocumentType(fileType)) {
      throw new BadRequestException('Invalid file type for secure upload');
    }

    const uploads = await s3Utils.generateSecurePresignedUrl({
      keyCount,
      fileType,
      folder,
      oldKeys
    });

    return res.status(StatusCodes.OK).json(uploads);
  } catch (error) {
    return next(error);
  }
};

/*-----------Upload Images Publicly--------------*/
export const publicUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileType, folder, keyCount = 1, oldKeys } = req.getValid
      ? req.getValid<IUploadRequestData>('json')
      : (req.body as unknown as IUploadRequestData);

    if (!s3Utils.validateImageType(fileType)) {
      throw new BadRequestException('Only images allowed for public upload');
    }

    const uploads = await s3Utils.generatePublicPresignedUrl({
      keyCount,
      fileType,
      folder,
      oldKeys
    });

    return res.status(StatusCodes.OK).json(uploads);
  } catch (error) {
    return next(error);
  }
};

/*-----------Get File Access URL--------------*/
export const getFileUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.params.key;
    const isSecure = req.query.secure === 'true';

    const url = isSecure ? await s3Utils.getSecureFileUrl(key) : s3Utils.getPublicFileUrl(key);

    return res.status(StatusCodes.OK).json({ url });
  } catch (error) {
    return next(error);
  }
};

/*-----------Delete Files--------------*/
export const deleteFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keys } = req.getValid
      ? req.getValid<{ keys: string[] }>('json')
      : (req.body as unknown as { keys: string[] });

    await s3Utils.deleteFiles(keys);
    return res.status(StatusCodes.OK).json({ message: `${keys.length} file(s) deleted` });
  } catch (error) {
    return next(error);
  }
};
