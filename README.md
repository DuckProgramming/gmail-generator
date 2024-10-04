# Gmail Email Generator using [Bun](https://bun.sh), [Playwright](https://playwright.dev/) and TypeScript

## Setup

1. Instale as dependências:
   ```bash
   bun install
   ```

2. Inicie o projeto:
   ```bash
   bun dev
   ```

## Configuração de Variáveis de Ambiente

Certifique-se de atualizar as variáveis de ambiente no arquivo `.env` antes de rodar o projeto.

### Configuração do Serviço de Email
```bash
MIN5=""
```

### Configuração do Serviço de Discord
```bash
BOT_TOKEN="SEU_BOT_TOKEN_AQUI"
WEBHOOK_TOKEN="SEU_WEBHOOK_TOKEN_AQUI"
WEBHOOK_ID="SEU_WEBHOOK_ID_AQUI"
```

### Configuração de AI
```bash
GEMINI_KEY="SUA_GEMINI_KEY_AQUI"
```

### Configuração do Scrapper
```bash
TARGET_URL="https://accounts.google.com/SignUp?service=mail"
MONTHS="January February March April May June July August September October November December"
COUNTRY="pk" # Escolha entre "us" (Estados Unidos) ou "pk" (Paquistão)
```

Com ❤ pela equipe DuckProgramming.
