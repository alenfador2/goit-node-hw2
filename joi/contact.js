const Joi = require('joi');

const addNewContact = Joi.object({
  name: Joi.string().min(3).max(33).required().messages({
    'string.pattern.base': 'Invalid name format',
    'any.requied': 'Name is required!',
  }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required()
    .messages({
      'string.pattern.base': 'Invalid email format',
      'any.required': 'Email is required!',
    }),
  phone: Joi.string().min(4).max(20).required().messages({
    'string.pattern.base': 'Invalid phone format',
    'any.required': 'Phone is required',
  }),
});

const changeContact = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    'string.pattern.base': 'Invalid name format',
  }),
  email: Joi.string().email().messages({
    'string.pattern.base': 'Invalid email format',
  }),
  phone: Joi.string().min(5).max(16).messages({
    'string.pattern.base': 'Invalid phone number format',
  }),
});

module.exports = {
  addNewContact,
  changeContact,
};
