import * as joi from "joi"

export const createCategoryValidator = joi
  .object({
    boardId: joi.number().required().label("Board"),
    measurementTypeId: joi.number().required().label("Measurement type"),
    name: joi.string().required().label("Name"),
    unit: joi.when("measurementTypeId", {
      is: 1,
      then: joi.string().required().messages({ "string.base": "Required for «Quantitative» activities." }),
      // otherwise: joi.equal(null).messages({ "any.only": "«Yes / no» activity cannot be measured with any unit." }),
    }),
  })
  .options({ abortEarly: false })
