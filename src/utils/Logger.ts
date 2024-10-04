import { cyan, gray, green, red, yellow } from 'colorette'

export function log(prefix: string, message: string) {
  const time = gray(new Date(Date.now()).toLocaleTimeString())

  console.log(`${green('LOG')} -> ${green(prefix)} ${time} ${cyan(message)}`)
}

export function warn(prefix: string, message: string) {
  const time = gray(new Date(Date.now()).toLocaleTimeString())

  console.log(`${yellow('WARN')} -> ${yellow(prefix)} ${time} ${cyan(message)}`)
}

export function error(prefix: string, message: string, error: Error | null) {
  const time = gray(new Date(Date.now()).toLocaleTimeString())

  console.log(
    `${red('ERROR')} -> ${red(prefix)} ${time} ${cyan(message)}`,
    error ? red(error.message) : null,
  )
}
