import { defineConfig } from 'prisma'

export default defineConfig({
  url: process.env.DATABASE_URL,
})