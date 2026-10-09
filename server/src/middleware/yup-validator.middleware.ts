import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as yup from 'yup';
import { ValidationType } from '../@types/express';

export const yupValidator = (type: ValidationType, schema: yup.AnySchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let data: unknown;

      // Get data based on validation type
      switch (type) {
        case 'json':
          data = req.body;
          break;
        case 'query':
          data = req.query;
          break;
        case 'param':
          data = req.params;
          break;
        case 'header':
          data = req.headers;
          break;
        default:
          throw new Error(`Unsupported validation type: ${type}`);
      }

      const validatedData = await schema.validate(data, {
        abortEarly: false,
        stripUnknown: true
      });

      // Clean empty objects and values from validated data
      const cleanedData = cleanEmptyValues(validatedData as Record<string, unknown>);

      // Initialize validatedData if it doesn't exist
      if (!req.validatedData) {
        req.validatedData = {};
      }

      // Store the validated data
      req.validatedData[type] = cleanedData;

      // Update Express request properties with cleaned validated data
      if (type === 'json') {
        req.body = cleanedData;
      } else if (type === 'query') {
        req.query = cleanedData as Request['query'];
      } else if (type === 'param') {
        req.params = cleanedData as Request['params'];
      }

      // Add helper method to get validated data
      if (!req.getValid) {
        req.getValid = <T = unknown>(validationType: ValidationType): T => {
          if (!req.validatedData || req.validatedData[validationType] === undefined) {
            throw new Error(`No validated data found for type: ${validationType}`);
          }
          return req.validatedData[validationType] as T;
        };
      }

      return next();
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: true,
          message: 'Validation failed',
          details: error.inner.map((err) => ({
            path: err.path,
            message: err.message
          }))
        });
      }
      return next(error);
    }
  };
};

export const cleanEmptyValues = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    const mappedArray = (obj as unknown[]).map((item: unknown) =>
      typeof item === 'object' && item !== null
        ? cleanEmptyValues(item as Record<string, unknown>)
        : item
    );

    return mappedArray.filter(
      (item: unknown) => item !== '' && item !== null && item !== undefined
    ) as unknown as Partial<T>;
  }

  const cleaned: Record<string, unknown> = { ...obj };

  Object.keys(cleaned).forEach((key) => {
    const val = cleaned[key];
    if (Array.isArray(val)) {
      const cleanedArray = (val as unknown[]).map((item: unknown) =>
        typeof item === 'object' && item !== null
          ? cleanEmptyValues(item as Record<string, unknown>)
          : item
      );

      const filtered = cleanedArray.filter(
        (item: unknown) => item !== '' && item !== null && item !== undefined
      );

      if (filtered.length === 0) {
        delete cleaned[key];
      } else {
        cleaned[key] = filtered;
      }
    } else if (val && typeof val === 'object' && !(val instanceof Date)) {
      const nested = cleanEmptyValues(val as Record<string, unknown>);

      if (Object.keys(nested).length === 0) {
        delete cleaned[key];
      } else {
        cleaned[key] = nested;
      }
    } else if (val === '' || val === null || val === undefined) {
      delete cleaned[key];
    }
  });

  return cleaned as Partial<T>;
};
