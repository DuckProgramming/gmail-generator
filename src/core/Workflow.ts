import { setup } from '../config'
import { Base, type BasePage } from '../entities/Base'
import { Person } from '../entities/Person'
import { error, log, warn } from '../utils/Logger'

export class Workflow extends Base {
  async execute(flows: BasePage[]): Promise<void> {
    const { page, browser, context } = await setup()

    try {
      const person = new Person()
      await person.setup()

      for (const flow of flows) {
        log('Workflow', `Executando flow. Prefix hash: ${flow.id}.`)

        await flow.execute(page, person)
      }
    } catch (err) {
      error('Workflow', 'Erro no flow.', err as Error)

      await context.clearCookies()
      await browser.close()

      warn('Workflow', 'Recarregando workflow.')

      await this.execute(flows)
    }
  }
}
