function ApiError(message = 'API request rejected.') {
  this.name = 'ApiError';
  this.message = message;
  this.stack = new Error().stack;
}

ApiError.prototype = Object.create(Error.prototype);

ApiError.prototype.constructor = ApiError;

export default ApiError;
