import type { Page } from 'playwright'
import { BasePage } from '../../entities/Base'
import type { Person } from '../../entities/Person'

export class ThirdPage extends BasePage {
  async execute(page: Page, person: Person): Promise<void> {
    this.page = page

    await page.waitForTimeout(3000)

    const locator = 'div[jsslot]'

    await page.waitForTimeout(500)

    const sections = await page.$$(locator)

    for (const target of sections) {
      const text = await target.innerText()

      if (text.trim() === 'Create your own Gmail address') {
        await target.click()
      }
    }

    await this.humanClick('input[type="text"][name="Username"]')
    await this.type(person.email)

    await this.next()
  }
}
