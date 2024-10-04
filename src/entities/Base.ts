import { randomBytes } from 'node:crypto'
import type { Page } from 'playwright'
import { config } from '../config'
import { BasePageError } from '../errors/BasePageError'
import { log } from '../utils/Logger'
import { getRandomInt } from '../utils/Rand'
import type { Person } from './Person'

export abstract class Base {
  id: string
  page: Page | null

  constructor() {
    this.page = null
    this.id = randomBytes(8).toString('hex')
  }

  abstract execute(...args: unknown[]): Promise<unknown>

  async hasError(): Promise<void> {
    const page = this.page

    if (!page) return

    await page.waitForTimeout(3000)

    const locators = config.errors.map((err) => {
      return page.locator(`div:has-text("${err}"):visible`)
    })

    const errors = []

    for (const locator of locators) {
      const targets = await locator.all()

      if (targets.length > 0) {
        for (let i = 0; i < targets.length; i++) {
          const text = await targets[i].innerText()

          if (config.errors.includes(text.trim())) {
            errors.push(text.trim())
            break
          }
        }
      }
    }

    for (const error of errors) {
      throw new BasePageError(error)
    }
  }

  async accept(): Promise<void> {
    const page = this.page

    if (!page) return

    await page.waitForTimeout(5000)

    let attempts = 0

    while (attempts < 5) {
      try {
        const one = page.locator('div[id="selectioni15"]')
        const second = page.locator('div[id="selectioni17"]')

        await one.click()
        await second.click()
        return
      } catch (error) {
        attempts++
        log(
          'BasePage',
          `Error when accepting terms (attempt ${attempts}/${5}): ${(error as Error).message}`,
        )

        if (attempts < 5) {
          await page.reload()
          log('BasePage', 'Reloading "accept terms" page.')
          await page.waitForLoadState()
          await page.waitForTimeout(5000)
        } else {
          throw new Error('Max retries reached while accepting terms.')
        }
      }
    }
  }

  async next(): Promise<void> {
    const page = this.page

    if (!page) return

    await page.waitForTimeout(500)

    const nextLocators = page.locator('span:has-text("Next"):visible')
    const skipLocators = page.locator('span:has-text("Skip"):visible')
    const continueLocators = page.locator('span:has-text("Continue"):visible')

    const locators = [nextLocators, skipLocators, continueLocators]

    for (const locator of locators) {
      const targets = await locator.all()

      for (const target of targets) {
        await target.click()
      }
    }
  }

  async type(content: string) {
    const page = this.page

    if (!page) return

    await page.keyboard.type(content, { delay: getRandomInt(15, 35) })
    await page.waitForTimeout(500)
  }

  async humanClick(selector: string) {
    const page = this.page

    if (!page) return

    const element = await page.waitForSelector(selector)
    const box = await element.boundingBox()
    if (!box) return

    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    await page.mouse.click(x, y, { delay: Math.random() * 100 + 100 })
  }
}

export abstract class BasePage extends Base {
  abstract execute(page: Page, person: Person): Promise<unknown>
}
