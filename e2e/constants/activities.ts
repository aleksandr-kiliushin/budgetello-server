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
  meditate: {
    board: { id: boards.productivePeople.id, name: boards.productivePeople.name },
    id: 6,
    measurementType: activityCategoryMeasurementTypes.quantitative,
    name: "meditate",
    owner: users.jessicaStark,
    unit: "min",
  },
} as const

export const activityRecords = {
  "1st": {
    booleanValue: null,
    category: activityCategories.running,
    comment: "",
    date: "2022-08-01",
    id: 1,
    quantitativeValue: 3.5,
  },
  "2nd": {
    booleanValue: null,
    category: activityCategories.pushups,
    comment: "",
    date: "2022-08-01",
    id: 2,
    quantitativeValue: 50,
  },
  "3rd": {
    booleanValue: true,
    category: activityCategories.noSweets,
    comment: "it was easy today",
    date: "2022-08-01",
    id: 3,
    quantitativeValue: null,
  },
  "4th": {
    booleanValue: null,
    category: activityCategories.sleep,
    comment: "",
    date: "2022-08-02",
    id: 4,
    quantitativeValue: 7.25,
  },
  "5th": {
    booleanValue: null,
    category: activityCategories.reading,
    comment: "Read chapter about DB",
    date: "2022-08-02",
    id: 5,
    quantitativeValue: 6,
  },
  "6th": {
    booleanValue: null,
    category: activityCategories.running,
    comment: "running in hills",
    date: "2022-08-03",
    id: 6,
    quantitativeValue: 4,
  },
  "7th": {
    booleanValue: null,
    category: activityCategories.meditate,
    comment: "",
    date: "2022-08-03",
    id: 7,
    quantitativeValue: 10,
  },
} as const
