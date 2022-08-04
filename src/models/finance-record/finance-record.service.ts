import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { FinanceCategoryService } from "#models/finance-category/finance-category.service"

import { CreateFinanceRecordDto } from "./dto/create-finance-record.dto"
import { GetFinanceRecordsDto } from "./dto/get-finance-records.dto"
import { UpdateFinanceRecordDto } from "./dto/update-finance-record.dto"
import { FinanceRecordEntity } from "./entities/finance-record.entity"

@Injectable()
export class FinanceRecordService {
  constructor(
    @InjectRepository(FinanceRecordEntity)
    private financeRecordRepository: Repository<FinanceRecordEntity>,

    private financeCategoryService: FinanceCategoryService
  ) {}

  getFinanceRecords({
    orderingByDate,
    orderingById,
    skip,
    take,
    ...where
  }: GetFinanceRecordsDto): Promise<FinanceRecordEntity[]> {
    return this.financeRecordRepository.find({
      order: {
        ...(orderingByDate === undefined ? {} : { date: orderingByDate }),
        ...(orderingById === undefined ? {} : { id: orderingById }),
      },
      relations: ["category", "category.type"],
      skip: skip ?? 0,
      ...(take ? { take } : {}),
      where,
    })
  }

  getFinanceRecord(id: FinanceRecordEntity["id"]): Promise<FinanceRecordEntity> {
    return this.financeRecordRepository.findOneOrFail({
      relations: ["category", "category.type"],
      where: { id },
    })
  }

  async createFinanceRecord(createFinanceRecordDto: CreateFinanceRecordDto): Promise<FinanceRecordEntity> {
    const { categoryId } = createFinanceRecordDto

    const record = this.financeRecordRepository.create(createFinanceRecordDto)

    record.category = await this.financeCategoryService.getFinanceCategory(categoryId)

    return this.financeRecordRepository.save(record)
  }

  async updateFinanceRecord(
    id: FinanceRecordEntity["id"],
    updateFinanceRecordDto: UpdateFinanceRecordDto
  ): Promise<FinanceRecordEntity> {
    const { categoryId, ...rest } = updateFinanceRecordDto

    const record = await this.getFinanceRecord(id)

    const updatedRecord = { ...record, ...rest }

    if (categoryId) {
      updatedRecord.category = await this.financeCategoryService.getFinanceCategory(categoryId)
    }

    return this.financeRecordRepository.save(updatedRecord)
  }

  async deleteFinanceRecord(id: FinanceRecordEntity["id"]): Promise<FinanceRecordEntity> {
    const record = await this.getFinanceRecord(id)

    await this.financeRecordRepository.delete(id)

    return record
  }
}
