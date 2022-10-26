import { Column, Entity, PrimaryColumn } from "typeorm"

import { ICurrency } from "#interfaces/currencies"

@Entity("currency")
export class CurrencyEntity {
  @Column({ type: "varchar" })
  name: ICurrency["name"]

  @PrimaryColumn({ type: "varchar" })
  slug: ICurrency["slug"]

  @Column({ type: "varchar" })
  symbol: ICurrency["symbol"]
}
