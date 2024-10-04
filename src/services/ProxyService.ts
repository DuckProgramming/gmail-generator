import { readFile } from 'node:fs/promises'

interface ProxyServiceProps {
  file: string
}

interface ProxyPayload {
  host: string
  port: string
  protocol: string
  username?: string
  password?: string
}

interface ProxyDTO {
  server_auth: `${string}://${string}:${string}@${string}:${string}`
  server: `${string}://${string}:${string}`
  username?: string
  password?: string
}

export class ProxyService {
  protected readonly file: string

  constructor(props: ProxyServiceProps) {
    this.file = props.file
  }

  async getJsonProxies(): Promise<ProxyPayload[]> {
    return JSON.parse(await readFile(this.file, 'utf-8')) as ProxyPayload[]
  }

  async getProxies(): Promise<ProxyPayload[]> {
    const proxies = (await readFile(this.file, 'utf-8')).split('\n')

    return proxies.map((target) => {
      const proxy = target.trim().split(':')

      return {
        host: proxy[0],
        port: proxy[1],
        username: proxy[2],
        password: proxy[3],
        protocol: 'http',
      }
    })
  }

  async get(type: 'json' | 'txt'): Promise<ProxyPayload> {
    const proxies =
      type === 'json' ? await this.getJsonProxies() : await this.getProxies()

    return proxies[Math.floor(Math.random() * proxies.length)]
  }

  toService(payload: ProxyPayload): ProxyDTO {
    return {
      server_auth: `${payload.protocol}://${payload.username}:${payload.password}@${payload.host}:${payload.port}`,
      server: `${payload.protocol}://${payload.host}:${payload.port}`,
      username: payload.username,
      password: payload.password,
    }
  }
}
