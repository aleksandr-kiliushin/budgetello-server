import { boards } from "./boards"
import { users } from "./users"

export const activityCategoryMeasurementTypes = {
  quantitative: { id: 1, name: "quantitative" },
  boolean: { id: 2, name: "boolean" },
} as const

export const activityCategories = {
  running: {
    board: { id: boards.beautifulSportsmen.id, name: boards.beautifulSportsmen.name },
    id: 1,
    measurementType: activityCategoryMeasurementTypes.quantitative,
    name: "running",
    owner: users.jessicaStark,
    unit: "km",
  },
  pushups: {
    board: { id: boards.beautifulSportsmen.id, name: boards.beautifulSportsmen.name },
    id: 2,
    measurementType: activityCategoryMeasurementTypes.quantitative,
    name: "pushups",
    owner: users.jessicaStark,
    unit: "time",
  },
  noSweets: {
    board: { id: boards.beautifulSportsmen.id, name: boards.beautifulSportsmen.name },
    id: 3,
    measurementType: activityCategoryMeasurementTypes.boolean,
    name: "no sweets",
    owner: users.jessicaStark,
    unit: null,
  },
  sleep: {
    board: { id: boards.beautifulSportsmen.id, name: boards.beautifulSportsmen.name },
    id: 4,
    measurementType: activityCategoryMeasurementTypes.quantitative,
    name: "sleep",
    owner: users.jessicaStark,
    unit: "hour",
  },
  reading: {
    board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
    id: 5,
    measurementType: activityCategoryMeasurementTypes.quantitative,
    name: "reading",
    owner: users.johnDoe,
    unit: "page",
  },
} as const
