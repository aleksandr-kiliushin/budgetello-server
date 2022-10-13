import * as joi from "joi"

export const createBoardValidator = joi
  .object({
    name: joi.string().required().label("Name"),
    subjectId: joi.number().required().label("Subject"),
  })
  .options({ abortEarly: false })
