import { join } from 'node:path'
import { red } from 'colorette'
import {
  type Browser,
  type BrowserContext,
  type Page,
  chromium,
  devices,
} from 'playwright'
import { ProxyService } from './services/ProxyService'
import { log } from './utils/Logger'

export interface SetupPayload {
  page: Page
  context: BrowserContext
  browser: Browser
}

export async function setup(headless?: boolean): Promise<SetupPayload> {
  log('Setup', `Iniciando o ${red('ProxyService')}.`)

  const service = new ProxyService({
    file: 'proxies.txt',
  })

  const proxy = await service.get('txt')

  const iphone = devices['iPhone 12']

  const browser = await chromium.launch({
    args: config.args,
    headless: headless ?? true,
  })

  log('Setup', `Iniciando o ${red('BrowserContext')}.`)

  const context = await browser.newContext({
    ...iphone,
    extraHTTPHeaders: config.headers,
    userAgent: config.userAgent,
    proxy: service.toService(proxy),
  })

  const page = await context.newPage()

  await page.goto(process.env.TARGET_URL as string, {
    waitUntil: 'networkidle',
    timeout: 600_000,
  })

  log('Setup', `Iniciando o ${red('HeadersBypass')}.`)

  await page.route('**/*', (route) => {
    const headers = {
      ...route.request().headers(),
      'sec-ch-ua': '',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': 'Windows',
    }
    route.continue({ headers })
  })

  log('Setup', `Iniciando o ${red('DocumentBypass')}.`)

  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => false,
    })

    Object.defineProperty(navigator, 'language', {
      get: () => 'en-US',
    })

    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    })

    Object.defineProperty(navigator, 'permissions', {
      get: () => ({
        query: async () => ({ state: 'granted' }),
      }),
    })

    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL
    HTMLCanvasElement.prototype.toDataURL = function (...args) {
      return originalToDataURL.apply(this, args)
    }
  })

  return { page, browser, context }
}

export const config = {
  errors: [
    'Sorry, we could not create your Google Account.',
    'This phone number cannot be used for verification.',
    'This phone number has been used too many times.',
    'Sorry, something went wrong there. Try again.',
  ],
  flows: join(import.meta.dirname, 'core', 'pages'),
  headers: {
    'accept-language': 'en-US,en;q=0.9',
  },
  userAgent:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1', //'user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
  args: [
    '--incognito',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--window-position=0,0',
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-spki-list',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--enable-features=NetworkService',
  ],
}
