import { NestFactory } from "@nestjs/core"

import { AppModule } from "src/app.module"

async function bootstrap() {
  if (process.env.API_PORT === undefined) {
    throw new Error("process.env.API_PORT is undefined.")
  }

  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.setGlobalPrefix("api")
  await app.listen(process.env.API_PORT)
}

bootstrap()
