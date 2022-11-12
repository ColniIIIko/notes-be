import Joi from 'joi';

const create = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message('must be an oid'),
});

const update = Joi.object({
  title: Joi.string().required(),
  body: Joi.string().required(),
});

export default { create, update };
