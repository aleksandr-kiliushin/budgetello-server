import { NestFactory } from "@nestjs/core"

import { setServerPinger } from "#helpers/set-server-pinger"

import { AppModule } from "src/app.module"

async function bootstrap() {
  if (process.env.PORT === undefined) {
    throw new Error("process.env.PORT is undefined.")
  }

  setServerPinger()

  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.setGlobalPrefix("api")
  await app.listen(process.env.PORT)
}

bootstrap()
