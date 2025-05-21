const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, 
  message: {
    errorCode: -429,
    errorDesc: 'Too many requests. Please try again after some time (limit is 10 requests per hour)'
  }
});

module.exports = limiter;