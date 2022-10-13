import * as joi from "joi"

export const createRecordValidator = joi
  .object({
    amount: joi.number().required().min(0.0000001).label("Amount").messages({ "number.min": '"Amount" is too low' }),
    categoryId: joi.number().required().label("Category"),
    date: joi
      .string()
      .required()
      .pattern(/^\d\d\d\d-\d\d-\d\d$/)
      .label("Date")
      .messages({ "string.pattern.base": '"Date" should have format YYYY-MM-DD' }),
  })
  .options({ abortEarly: false })
