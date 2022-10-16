import { UseGuards } from "@nestjs/common"
import { Args, Int, Query, Resolver } from "@nestjs/graphql"

import { AuthorizationGuard } from "#models/authorization/guard"
import { UserEntity } from "#models/users/entities/user.entity"

import { AuthorizedUser } from "#helpers/AuthorizedUser.decorator"

import { SearchBudgetRecordsArgs } from "./dto/search-budget-records.args"
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

  // @Post()
  // create(
  //   @Body(new ValidationPipe())
  //   requestBody: CreateBudgetRecordDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.budgetRecordsService.create({ authorizedUser, requestBody })
  // }

  // @Patch(":recordId")
  // update(
  //   @Param("recordId", ParseIntPipe)
  //   recordId: number,
  //   @Body()
  //   requestBody: UpdateBudgetRecordDto,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.budgetRecordsService.update({ authorizedUser, recordId, requestBody })
  // }

  // @Delete(":recordId")
  // delete(
  //   @Param("recordId", ParseIntPipe)
  //   recordId: number,
  //   @AuthorizedUser()
  //   authorizedUser: UserEntity
  // ) {
  //   return this.budgetRecordsService.delete({ authorizedUser, recordId })
  // }
}
