import { randomBytes } from 'node:crypto'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { red } from 'colorette'
import { log } from '../utils/Logger'
import { getRandomInt } from '../utils/Rand'

export interface BirthdayPayload {
  day: string
  month: string
  year: string
}

export interface AIResponse {
  firstName: string
  lastName: string
}

export class Person {
  firstName: string
  lastName: string
  email: string
  password: string
  birthday: BirthdayPayload
  protected _phone: string | null

  constructor() {
    this.firstName = ''
    this.lastName = ''
    this.email = ''
    this.password = this.generatePassword()
    this.birthday = this.generateBirthday()
    this._phone = null
  }

  async setup(): Promise<AIResponse> {
    const ai = new GoogleGenerativeAI(process.env.GEMINI_KEY as string)
    const model = ai.getGenerativeModel({ model: 'gemini-pro' })

    const prompt =
      'Return a JSON with the fields: firstName and lastName. They should be real names from south america, north america and central america, as random as possible, without special characters. Respond with valid JSON only, without escape ```json```, nothing else.'

    const target = await model.generateContent([prompt])
    const result = JSON.parse(target.response.text()) as AIResponse

    this.firstName = result.firstName
    this.lastName = result.lastName
    this.email = this.generateEmail()

    log('IA', `Pessoa gerada pela IA ➜\n\t${red(JSON.stringify(result))}\n`)

    return result
  }

  protected generateEmail(): string {
    const first = this.firstName.toLowerCase()
    const last = this.lastName.toLowerCase()
    const rand = randomBytes(3).toString('hex')

    return `${first}.${last}.${rand}`
  }

  protected generatePassword(): string {
    const rand = randomBytes(8).toString('base64url')

    return rand
  }

  protected generateBirthday(): BirthdayPayload {
    const months = (process.env.MONTHS as string).split(' ')

    const month = months[getRandomInt(0, months.length - 1)]
    const day = getRandomInt(1, 28).toString()
    const year = getRandomInt(1970, 2004).toString()

    return { day, month, year }
  }
}
