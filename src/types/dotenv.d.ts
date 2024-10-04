// dotenv.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    COUNTRY: string
    BOT_TOKEN: string
    WEBHOOK_TOKEN: string
    WEBHOOK_ID: string
    GEMINI_KEY: string
    TARGET_URL: string
    MONTHS: string
    MIN5: string
  }
}
