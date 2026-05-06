import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of } from 'rxjs';
import { ResponseInterceptor } from './response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor;
  let mockContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  function createMocks(statusCode: number) {
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue({ statusCode }),
      }),
    } as any;

    mockCallHandler = {
      handle: jest.fn(),
    } as any;
  }

  it('should wrap data with default 200 message', (done) => {
    createMocks(200);
    mockCallHandler.handle.mockReturnValue(of({ id: 1, name: 'test' }));

    interceptor.intercept(mockContext, mockCallHandler).subscribe((res) => {
      expect(res).toEqual({
        success: true,
        statusCode: 200,
        message: 'Success',
        data: { id: 1, name: 'test' },
      });
      done();
    });
  });

  it('should return Created successfully for 201', (done) => {
    createMocks(201);
    mockCallHandler.handle.mockReturnValue(of({ id: 1 }));

    interceptor.intercept(mockContext, mockCallHandler).subscribe((res) => {
      expect(res.message).toBe('Created successfully');
      done();
    });
  });

  it('should return Deleted successfully for 204', (done) => {
    createMocks(204);
    mockCallHandler.handle.mockReturnValue(of(null));

    interceptor.intercept(mockContext, mockCallHandler).subscribe((res) => {
      expect(res.message).toBe('Deleted successfully');
      done();
    });
  });

  it('should return OK for unknown status codes', (done) => {
    createMocks(301);
    mockCallHandler.handle.mockReturnValue(of(null));

    interceptor.intercept(mockContext, mockCallHandler).subscribe((res) => {
      expect(res.message).toBe('OK');
      done();
    });
  });

  it('should use custom __message from controller', (done) => {
    createMocks(201);
    const controllerData = {
      __message: 'User created successfully',
      id: 42,
      name: 'John',
    };
    mockCallHandler.handle.mockReturnValue(of(controllerData));

    interceptor.intercept(mockContext, mockCallHandler).subscribe((res) => {
      expect(res).toEqual({
        success: true,
        statusCode: 201,
        message: 'User created successfully',
        data: { id: 42, name: 'John' },
      });
      done();
    });
  });

  it('should set data to null when data is undefined', (done) => {
    createMocks(200);
    mockCallHandler.handle.mockReturnValue(of(undefined));

    interceptor.intercept(mockContext, mockCallHandler).subscribe((res) => {
      expect(res.data).toBeNull();
      done();
    });
  });

  it('should set data to null when data is null', (done) => {
    createMocks(200);
    mockCallHandler.handle.mockReturnValue(of(null));

    interceptor.intercept(mockContext, mockCallHandler).subscribe((res) => {
      expect(res.data).toBeNull();
      done();
    });
  });

  it('should not strip __message when it is not a top-level key', (done) => {
    createMocks(200);
    const data = { nested: { __message: 'should stay' } };
    mockCallHandler.handle.mockReturnValue(of(data));

    interceptor.intercept(mockContext, mockCallHandler).subscribe((res) => {
      expect(res.data).toEqual({ nested: { __message: 'should stay' } });
      done();
    });
  });
});
