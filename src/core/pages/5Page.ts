import { FiveSim } from '5sim-api'
import type { Page } from 'playwright'
import { BasePage } from '../../entities/Base'
import type { Person } from '../../entities/Person'
import { log } from '../../utils/Logger'

export class FifthPage extends BasePage {
  protected numberService: FiveSim

  constructor() {
    super()

    this.numberService = new FiveSim(process.env.MIN5)
  }

  async execute(page: Page, person: Person): Promise<void> {
    this.page = page

    const partial = await this.numberService.getOrderHistory('activation')
    const filtered = partial.Data.filter(
      (o) => o.status === 'RECEIVED' || o.status === 'PENDING',
    )
    log('FifthPage', 'Syncing orders.')

    for (const order of filtered) {
      const dateNow = Date.now()
      const expirationDate = new Date(order.expires).getTime()

      const left = expirationDate - dateNow

      if (Math.floor(left / 60000) < 18) {
        log('FifthPage', `Order ${order.phone} canceled.`)

        await this.numberService.cancelNumber(order.id)
      }
    }

    await page.waitForSelector('div[id="countryList"]')

    await this.humanClick('div[id="countryList"]')

    await page.waitForTimeout(1000)

    const locator = page.locator('li[data-value="pk"]')
    await locator.click()

    const number = await this.numberService.buyActivationNumber({
      country: 'pak',
      operator: 'any',
      product: 'google',
    })

    await this.humanClick('input[id="phoneNumberId"]')
    await this.type(number.phone.replace('+92', ''))

    await this.next()

    const content = await page.content()

    const regex =
      /This phone number (cannot be used for verification\.?|has been used too many times)/

    if (regex.test(content)) {
      await this.numberService.cancelNumber(Number(content))

      log(
        'FifthPage',
        `O número ${number.phone} não pode ser usado para verificação.`,
      )
    }

    await this.hasError()

    await page.waitForSelector('input[id="code"]')

    const sms = await this.numberService.waitForSMS({
      id: number.id.toString(),
    })

    await this.humanClick('input[id="code"]')
    await this.type(sms.code.toString())

    await this.next()
    await page.waitForTimeout(5040)

    // Recovery email?
    await this.next()
    await page.waitForTimeout(5020)

    // Add phone number?
    await this.next()
    await page.waitForTimeout(5102)

    // Review your account info
    await this.next()
    await page.waitForTimeout(5100)

    // Privacy and Terms
    await this.accept()
    await this.next()
    await page.evaluate(() => {
      //@ts-ignore
      window.scrollBy(0, window.innerHeight)
    })
  }
}
