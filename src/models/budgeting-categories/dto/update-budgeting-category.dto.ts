import { PartialType } from "@nestjs/mapped-types"

import { CreateBudgetingCategoryDto } from "./create-budgeting-category.dto"

export class UpdateBudgetingCategoryDto extends PartialType(CreateBudgetingCategoryDto) {}
