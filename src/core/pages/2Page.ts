import type { Page } from 'playwright'
import { BasePage } from '../../entities/Base'
import type { Person } from '../../entities/Person'

export class SecondPage extends BasePage {
  async execute(page: Page, person: Person): Promise<void> {
    this.page = page

    const month = page.locator('select[id="month"]')
    await month.selectOption(person.birthday.month)

    await page.waitForTimeout(500)

    await this.humanClick('input[type="tel"][aria-label="Day"]')
    await this.type(person.birthday.day)

    await page.waitForTimeout(500)

    await this.humanClick('input[type="tel"][aria-label="Year"]')
    await this.type(person.birthday.year)

    const gender = page.locator('select[id="gender"]')
    await gender.selectOption('Male')

    await this.next()
  }
}
