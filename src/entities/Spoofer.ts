import { createSign, generateKeyPairSync, randomBytes } from 'node:crypto'

export interface SignaturePayload {
  signature: string
  publicKey: string
}

export class Spoofer {
  readonly data: string
  readonly spoofer: SignaturePayload

  constructor() {
    this.data = randomBytes(256).toString('base64url')
    this.spoofer = this.sign()
  }

  sign(): SignaturePayload {
    const payload = {
      props: `page.evaluate(() => { Object.sign(window.navigator, '${this.data}') })`,
      struct: {
        head: '49ec1010a9a1a4c2a6aceead9d115eb9d60a1630',
        target: 'systemless',
      },
    }

    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    })

    const signer = createSign('RSA-SHA256')
    signer.update(JSON.stringify(payload))
    signer.end()

    const signature = signer.sign(privateKey, 'hex')

    return {
      signature,
      publicKey: publicKey.export().toString('utf-8'),
    }
  }
}
