const {
  getErrorMessage,
  getErrorData,
  setErrorResponse,
  mapValidationErrors,
} = require('../../src/utils/errorResponse');

const { StatusCodes } = require('http-status-codes');

describe('getErrorMessage', () => {
  it('should return the SQL message when error has a parent with sqlMessage', () => {
    const error = {
      parent: {
        sqlMessage: 'SQL error message',
      },
    };

    const errorMessage = getErrorMessage(error);
    expect(errorMessage).toBe('SQL error message');
  });

  it('should return the error message when error has a message property', () => {
    const error = {
      message: 'Generic error message',
    };

    const errorMessage = getErrorMessage(error);
    expect(errorMessage).toBe('Generic error message');
  });

  it('should return the error itself when no message or sqlMessage is found', () => {
    const error = 'No error message';
    const errorMessage = getErrorMessage(error);
    expect(errorMessage).toBe('No error message');
  });

  it('should return the error message even if the parent object exists but does not have sqlMessage', () => {
    const error = {
      parent: {
        someOtherField: 'Other field value',
      },
      message: 'Generic error message',
    };

    const errorMessage = getErrorMessage(error);
    expect(errorMessage).toBe('Generic error message');
  });
});

describe('getErrorData', () => {
  it('should return an empty array when errors property is not an array', () => {
    const error = {
      errors: 'Not an array',
    };

    const errorData = getErrorData(error);
    expect(errorData).toBeUndefined();
  });

  it('should extract and return error data when error is properly formatted', () => {
    const error = {
      errors: [
        {
          message: 'Validation error message',
          type: 'Validation error type',
          path: 'Field path',
          value: 'Invalid value',
        },
        {
          message: 'Another error message',
          type: 'Another error type',
          path: 'Another field path',
          value: 'Another invalid value',
        },
      ],
    };

    const errorData = getErrorData(error);

    const expectedData = [
      {
        message: 'Validation error message',
        type: 'Validation error type',
        path: 'Field path',
        value: 'Invalid value',
      },
      {
        message: 'Another error message',
        type: 'Another error type',
        path: 'Another field path',
        value: 'Another invalid value',
      },
    ];

    expect(errorData).toEqual(expectedData);
  });
});

describe('setErrorResponse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set a 500 status code and log the error when error name is not in sequelizeErrorNames', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const error = new Error('Generic error');
    error.name = 'SomeError';

    setErrorResponse(res, error);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: getErrorMessage(error),
      data: getErrorData(error),
    });
  });

  it('should set a 400 status code and log the error when error name is in sequelizeErrorNames', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const error = new Error('Validation error');
    error.name = 'SequelizeValidationError';

    setErrorResponse(res, error);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: getErrorMessage(error),
      data: getErrorData(error),
    });
  });
});

describe('mapValidationErrors', () => {
  it('should throw an ErrorResponse with a 400 status code and valid error messages', () => {
    const error = {
      inner: [
        {
          errors: ['Error 1', 'Error 2'],
          path: 'field1',
        },
        {
          errors: ['Error 3'],
          path: 'field2',
        },
      ],
    };

    const expectedMessage = 'Values provided to input fields(field1, field2) are not valid.';
    const expectedErrors = [
      { message: 'Error 1, Error 2', path: 'field1' },
      { message: 'Error 3', path: 'field2' },
    ];

    try {
      mapValidationErrors(error);
    } catch (error) {
      expect(error.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(error.message).toBe(expectedMessage);
      expect(error.errors).toEqual(expectedErrors);
    }
  });

  it('should throw an ErrorResponse with a 400 status code and the original error message if inner is not an array', () => {
    const error = {
      message: 'Validation error message',
    };

    try {
      mapValidationErrors(error);
    } catch (err) {
      expect(err.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(err.message).toBe(error.message);
    }
  });

  it('should throw an ErrorResponse with a 400 status code and the original error message if inner is an empty array', () => {
    const error = {
      inner: [],
      message: 'Validation error message',
    };

    try {
      mapValidationErrors(error);
    } catch (err) {
      expect(err.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(err.message).toBe(error.message);
    }
  });
});
