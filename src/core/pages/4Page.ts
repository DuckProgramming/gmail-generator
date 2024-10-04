import type { Page } from 'playwright'
import { BasePage } from '../../entities/Base'
import type { Person } from '../../entities/Person'

export class FourthPage extends BasePage {
  async execute(page: Page, person: Person): Promise<void> {
    this.page = page

    await this.humanClick('input[type="password"][aria-label="Password"]')
    await this.type(person.password)

    await page.waitForTimeout(500)

    await this.humanClick('input[type="password"][aria-label="Confirm"]')
    await this.type(person.password)

    await this.next()

    await this.hasError()
  }
}
