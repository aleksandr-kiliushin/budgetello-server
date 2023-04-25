// I have no idea how it works.
import * as crypto from "node:crypto"

import { GqlErrorCode } from "#constants"

import { GqlError } from "./GqlError"

const algorithm = "aes-256-ctr"
const USER_PASSWORD_ENCRYPTION_INITIALIZION_VECTOR_STRINGIFIED =
  process.env.USER_PASSWORD_ENCRYPTION_INITIALIZION_VECTOR_STRINGIFIED
const USER_PASSWORD_ENCRYPTION_SECRET_PHRASE = process.env.USER_PASSWORD_ENCRYPTION_SECRET_PHRASE

export const encrypt = (text: string) => {
  if (USER_PASSWORD_ENCRYPTION_INITIALIZION_VECTOR_STRINGIFIED === undefined) {
    throw new GqlError(GqlErrorCode.INTERNAL_SERVER_ERROR, {
      message: "Server has no USER_PASSWORD_ENCRYPTION_INITIALIZION_VECTOR_STRINGIFIED set.",
    })
  }

  if (USER_PASSWORD_ENCRYPTION_SECRET_PHRASE === undefined) {
    throw new GqlError(GqlErrorCode.INTERNAL_SERVER_ERROR, {
      message: "Server has no USER_PASSWORD_ENCRYPTION_SECRET_PHRASE set.",
    })
  }

  const cipher = crypto.createCipheriv(
    algorithm,
    USER_PASSWORD_ENCRYPTION_SECRET_PHRASE,
    Buffer.from(USER_PASSWORD_ENCRYPTION_INITIALIZION_VECTOR_STRINGIFIED, "hex")
  )
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])
  return encrypted.toString("hex")
}

// export const decrypt = (hash: string) => {
//   const decipher = crypto.createDecipheriv(
//     algorithm,
//     USER_PASSWORD_ENCRYPTION_SECRET_PHRASE,
//     Buffer.from(USER_PASSWORD_ENCRYPTION_INITIALIZION_VECTOR_STRINGIFIED, "hex")
//   )
//   const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, "hex")), decipher.final()])
//   return decrpyted.toString()
// }
