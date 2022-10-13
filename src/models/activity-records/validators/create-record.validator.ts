import * as joi from "joi"

export const createRecordValidator = joi
  .object({
    booleanValue: joi.boolean().allow(null).label("Yes / no"),
    categoryId: joi.number().required().label("Category"),
    comment: joi.string().required().min(0).label("Comment"),
    date: joi
      .string()
      .required()
      .pattern(/^\d\d\d\d-\d\d-\d\d$/)
      .label("Date")
      .messages({ "string.pattern.base": '"Date" should have format YYYY-MM-DD' }),
    quantitativeValue: joi.number().allow(null).label("Amount"),
  })
  .options({ abortEarly: false })
