import { HttpException, HttpStatus } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';
import { GlobalExceptionFilter } from './http-exception.filter';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockResponse: jest.Mocked<Response>;
  let mockRequest: jest.Mocked<Request>;
  let mockHost: jest.Mocked<ArgumentsHost>;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockResponse = {
      status: mockStatus,
    } as any;

    mockRequest = {
      url: '/test',
    } as any;

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as any;

    filter = new GlobalExceptionFilter();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function getJsonArg(): any {
    return mockJson.mock.calls[0][0];
  }

  describe('HttpException', () => {
    it('should handle HttpException with string message', () => {
      const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(getJsonArg()).toMatchObject({
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Not Found',
        path: '/test',
      });
      expect(getJsonArg()).toHaveProperty('timestamp');
    });

    it('should handle HttpException with object response containing message', () => {
      const exception = new HttpException(
        { message: 'Validation failed', error: 'Bad Request' },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(getJsonArg().message).toBe('Validation failed');
    });

    it('should handle HttpException with array message', () => {
      const exception = new HttpException(
        {
          message: ['email is required', 'password is too short'],
          error: 'Bad Request',
        },
        HttpStatus.BAD_REQUEST,
      );

      filter.catch(exception, mockHost);

      expect(getJsonArg().message).toBe(
        'email is required, password is too short',
      );
    });

    it('should handle HttpException with object response without message key', () => {
      const exception = new HttpException(
        { error: 'Forbidden' },
        HttpStatus.FORBIDDEN,
      );

      filter.catch(exception, mockHost);

      expect(getJsonArg().message).toBe('Http Exception');
    });
  });

  describe('Prisma errors', () => {
    it('should handle Prisma P2002 (duplicate entry)', () => {
      const exception = { code: 'P2002', meta: { target: ['email'] } };

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(getJsonArg().message).toBe('Already exists — duplicate entry');
    });

    it('should handle Prisma P2025 (record not found)', () => {
      const exception = { code: 'P2025', meta: {} };

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(getJsonArg().message).toBe('Record not found');
    });

    it('should handle Prisma P2003 (invalid reference)', () => {
      const exception = { code: 'P2003', meta: {} };

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(getJsonArg().message).toBe('Invalid reference');
    });

    it('should handle unknown Prisma error code', () => {
      const exception = { code: 'P2020', meta: {} };

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(getJsonArg().message).toBe('Database error');
    });
  });

  describe('Generic Error', () => {
    const OLD_ENV = process.env;

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it('should hide error message in production', () => {
      process.env.NODE_ENV = 'production';
      const exception = new Error('Internal database connection failed');

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(getJsonArg().message).toBe('Something went wrong');
      expect(getJsonArg()).not.toHaveProperty('stack');
    });

    it('should expose error message and stack in development', () => {
      process.env.NODE_ENV = 'development';
      const exception = new Error('Debug info');
      exception.stack = 'Error: Debug info\n    at Test.fn (file.ts:1:1)';

      filter.catch(exception, mockHost);

      expect(getJsonArg().message).toBe('Debug info');
      expect(getJsonArg().stack).toBe(exception.stack);
    });
  });

  describe('Unknown exception (not HttpException, Prisma, or Error)', () => {
    it('should return fallback message for unknown exception type', () => {
      const exception = { someRandomField: 'just an object' };

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(getJsonArg().message).toBe('Something went wrong');
    });
  });
});
