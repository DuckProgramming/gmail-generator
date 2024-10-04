import { red } from 'colorette'
import { config } from './config'
import { Workflow } from './core/Workflow'
import type { BasePage } from './entities/Base'
import { Spoofer } from './entities/Spoofer'
import { preload } from './services/Walker'
import { log } from './utils/Logger'

async function bootstrap() {
  const { data, spoofer } = new Spoofer()

  log('Bootstrap', 'Spoofer aplicado.')
  log('Bootstrap', `Assinatura do spoofer →\n${red(spoofer.signature)}\n`)
  log('Bootstrap', `Chave pública do spoofer →\n${red(spoofer.publicKey)}\n`)
  log('Bootstrap', `Spoofer data →\n${red(data)}\n`)

  const flows: BasePage[] = []

  for await (const flow of preload(config.flows)) {
    flows.push(flow)
  }

  const workflow = new Workflow()
  await workflow.execute(flows)
}

bootstrap()
