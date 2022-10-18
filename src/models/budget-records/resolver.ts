import { UseGuards } from "@nestjs/common"
import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql"

import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizationGuard } from "#helpers/authorization.guard"
import { AuthorizedUser } from "#helpers/authorized-user.decorator"
import { ValidationPipe } from "#helpers/validation.pipe"

import { CreateBudgetRecordInput } from "./dto/create-budget-record.input"
import { SearchBudgetRecordsArgs } from "./dto/search-budget-records.args"
import { UpdateBudgetRecordInput } from "./dto/update-budget-record.input"
import { BudgetRecordEntity } from "./entities/budget-record.entity"
import { BudgetRecord } from "./models/budget-record.model"
import { BudgetRecordsService } from "./service"

@Resolver(() => BudgetRecord)
@UseGuards(AuthorizationGuard)
export class BudgetRecordsResolver {
  constructor(private readonly budgetRecordsService: BudgetRecordsService) {}

  @Query((returns) => [BudgetRecord], { name: "budgetRecords" })
  search(
    @Args()
    args: SearchBudgetRecordsArgs,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetRecordEntity[]> {
    return this.budgetRecordsService.search({ args, authorizedUser })
  }

  @Query((returns) => BudgetRecord, { name: "budgetRecord" })
  find(
    @Args("id", { type: () => Int })
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetRecordEntity> {
    return this.budgetRecordsService.find({ authorizedUser, recordId })
  }

  @Mutation((returns) => BudgetRecord, { name: "createBudgetRecord" })
  create(
    @Args("input", ValidationPipe)
    input: CreateBudgetRecordInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetRecordEntity> {
    return this.budgetRecordsService.create({ authorizedUser, input })
  }

  @Mutation((returns) => BudgetRecord, { name: "updateBudgetRecord" })
  update(
    @Args("input", ValidationPipe)
    input: UpdateBudgetRecordInput,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetRecordEntity> {
    return this.budgetRecordsService.update({ authorizedUser, input })
  }

  @Mutation((returns) => BudgetRecord, { name: "deleteBudgetRecord" })
  delete(
    @Args("id", { type: () => Int })
    recordId: number,
    @AuthorizedUser()
    authorizedUser: UserEntity
  ): Promise<BudgetRecordEntity> {
    return this.budgetRecordsService.delete({ authorizedUser, recordId })
  }
}
