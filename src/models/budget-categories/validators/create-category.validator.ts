import * as joi from "joi"

export const createCategoryValidator = joi
  .object({
    boardId: joi.number().required().label("Board"),
    name: joi.string().required().label("Name"),
    typeId: joi.number().required().label("Type"),
  })
  .options({ abortEarly: false })
