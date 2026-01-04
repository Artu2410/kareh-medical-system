import { defineConfig } from '@prisma/cli';

export default defineConfig({
  datasource: {
    provider: process.env.DATABASE_PROVIDER || 'postgres',
    url: process.env.DATABASE_URL,
  },
});
