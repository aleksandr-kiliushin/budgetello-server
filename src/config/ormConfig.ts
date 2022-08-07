import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { DataSource } from "typeorm"

export const ormConfig: TypeOrmModuleOptions = {
  database: process.env.DATABASE_NAME ?? "personal_app_db",
  entities: ["dist/**/*.entity.ts"],
  host: process.env.DATABASE_HOST ?? "personal-app-database", // Name of database service in compose.dev.yml.
  migrations: ["src/migrations/*.ts"],
  migrationsTableName: "migrations",
  password: process.env.POSTGRES_PASSWORD ?? "123",
  port: 5432,
  ssl: false,
  synchronize: process.env.MODE === "dev", // Once you get into production you'll need to synchronize model changes into the database. It is unsafe to use `synchronize: true` for schema synchronization on production once you get data in your database. Here is where migrations come to help.
  type: "postgres",
  username: process.env.DATABASE_USERNAME ?? "postgres",
}

export const dataSource = new DataSource({
  ...ormConfig,
  host: "localhost", // For TypeORM CLI to be able to run migrations when db is inside a docker container.
})
