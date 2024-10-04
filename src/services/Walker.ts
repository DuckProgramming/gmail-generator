import { existsSync } from 'node:fs'
import { access, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { BasePage } from '../entities/Base'
import { error, log } from '../utils/Logger'

export type Ctor<T> = new (...args: unknown[]) => T

export async function writeText(path: string, data: string): Promise<void> {
  try {
    await writeFile(path, data)

    log('Walker', `Arquivo salvo: ${path}`)
  } catch (err) {
    error('Walker', `Erro ao tentar salvar o arquivo: ${path}`, err as Error)
  }
}

export async function writeJson(path: string, data: unknown): Promise<void> {
  try {
    const has = existsSync(path)

    if (!has) {
      return await writeFile(path, JSON.stringify([data], null, 2))
    }

    const content = JSON.parse(await readFile(path, 'utf-8')) as unknown[]
    content.push(data)

    await writeFile(path, JSON.stringify(content, null, 2))
  } catch (err) {
    error('Walker', `Erro ao tentar salvar o arquivo: ${path}`, err as Error)
  }
}

export async function tryPath(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

export async function* walk(path: string) {
  try {
    const targets = await readdir(path)

    for (const target of targets) {
      yield join(path, target)
    }
  } catch (err) {
    error('Walker', `Erro ao fazer walk do arquivo: ${path}`, err as Error)
  }
}

export async function* preload(path: string) {
  try {
    for await (const target of walk(path)) {
      const module = await import(target)

      for (const mod of Object.values(module)) {
        yield new (mod as Ctor<BasePage>)()
      }
    }
  } catch (err) {
    error('Walker', `Erro ao fazer preload do arquivo: ${path}`, err as Error)
  }
}
