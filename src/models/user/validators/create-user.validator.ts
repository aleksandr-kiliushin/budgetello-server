import * as joi from "joi"

export const createUserValidator = joi
  .object({
    username: joi.string().required().label("Username"),
    password: joi.string().required().label("Password"),
  })
  .options({ abortEarly: false })
