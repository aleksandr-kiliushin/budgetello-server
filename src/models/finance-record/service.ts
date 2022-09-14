import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { FinanceCategoryService } from "#models/finance-category/service"

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

  search({
    orderingByDate = "desc",
    orderingById = "desc",
    skip = 0,
    take,
    ...where
  }: GetFinanceRecordsDto): Promise<FinanceRecordEntity[]> {
    return this.financeRecordRepository.find({
      order: {
        ...(orderingByDate === undefined ? {} : { date: orderingByDate }),
        ...(orderingById === undefined ? {} : { id: orderingById }),
      },
      relations: ["category", "category.type"],
      skip,
      ...(take === undefined ? {} : { take }),
      where,
    })
  }

  async findById(id: FinanceRecordEntity["id"]): Promise<FinanceRecordEntity> {
    const financeRecord = await this.financeRecordRepository.findOne({
      relations: ["category", "category.type"],
      where: { id },
    })
    if (financeRecord === null) {
      throw new NotFoundException({ message: `Record with ID '${id}' not found.` })
    }
    return financeRecord
  }

  async create(createFinanceRecordDto: CreateFinanceRecordDto): Promise<FinanceRecordEntity> {
    if (createFinanceRecordDto.amount === undefined) {
      throw new BadRequestException({ fields: { amount: "Required field." } })
    }
    if (typeof createFinanceRecordDto.amount !== "number" || createFinanceRecordDto.amount <= 0) {
      throw new BadRequestException({ fields: { amount: "Should be a positive number." } })
    }
    const record = this.financeRecordRepository.create(createFinanceRecordDto)
    record.category = await this.financeCategoryService.findById(createFinanceRecordDto.categoryId)
    return this.financeRecordRepository.save(record)
  }

  async updateFinanceRecord(
    id: FinanceRecordEntity["id"],
    updateFinanceRecordDto: UpdateFinanceRecordDto
  ): Promise<FinanceRecordEntity> {
    const { categoryId, ...rest } = updateFinanceRecordDto

    const record = await this.findById(id)

    const updatedRecord = { ...record, ...rest }

    if (categoryId !== undefined) {
      updatedRecord.category = await this.financeCategoryService.findById(categoryId)
    }

    return this.financeRecordRepository.save(updatedRecord)
  }

  async deleteFinanceRecord(id: FinanceRecordEntity["id"]): Promise<FinanceRecordEntity> {
    const record = await this.findById(id)
    await this.financeRecordRepository.delete(id)
    return record
  }
}
