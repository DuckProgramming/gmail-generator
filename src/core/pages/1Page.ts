import type { Page } from 'playwright'
import { BasePage } from '../../entities/Base'
import type { Person } from '../../entities/Person'

export class FirstPage extends BasePage {
  async execute(page: Page, person: Person): Promise<void> {
    this.page = page

    const first = 'input[type="text"][name="firstName"]'
    const last = 'input[type="text"][name="lastName"]'

    await page.waitForSelector(first)
    await this.humanClick(first)
    await this.type(person.firstName)

    await page.waitForSelector(last)
    await this.humanClick(last)
    await this.type(person.lastName)

    await this.next()
  }
}
