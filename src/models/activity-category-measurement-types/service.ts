import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { ActivityCategoryMeasurementTypeEntity } from "./entities/activity-category-measurement-type.entity"

@Injectable()
export class ActivityCategoryMeasurementTypesService {
  constructor(
    @InjectRepository(ActivityCategoryMeasurementTypeEntity)
    private activityCategoryMeasurementTypesRepository: Repository<ActivityCategoryMeasurementTypeEntity>
  ) {}

  getAll(): Promise<ActivityCategoryMeasurementTypeEntity[]> {
    return this.activityCategoryMeasurementTypesRepository.find()
  }

  find({
    typeId,
  }: {
    typeId: ActivityCategoryMeasurementTypeEntity["id"]
  }): Promise<ActivityCategoryMeasurementTypeEntity> {
    return this.activityCategoryMeasurementTypesRepository.findOneOrFail({
      where: { id: typeId },
    })
  }
}
