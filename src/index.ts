type Lang = 'en' | 'ru'

type QueryParams = {
  token: string
  lang?: Lang
}

type TwoIP = QueryParams

type BuildApiUrl = QueryParams & {
  service?: string
  address?: string
}

function buildApiUrl({ service, address, token, lang }: BuildApiUrl): string {
  const baseUrl = 'https://api.2ip.io'
  const path = [service, address].filter(Boolean).join('/')
  const url = new URL(`${baseUrl}/${path}`)

  url.searchParams.set('token', token)
  if (lang) {
    url.searchParams.set('lang', lang)
  }

  return url.toString()
}

export function twoip({ token, lang }: TwoIP) {
  const ipInfo = async (ip?: string) => {
    const url = buildApiUrl({ address: ip, token, lang })

    console.log(url)

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP status: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Response API:', data)

      return data
    } catch (error) {
      console.log(error)
    }
  }

  return { ipInfo }
}

if (!process.env.TSDOWN_TOKEN) {
  throw new Error('TSDOWN_TOKEN not found in .env')
}

const { ipInfo } = twoip({ token: process.env.TSDOWN_TOKEN, lang: 'ru' })

ipInfo()
ipInfo('138.249.149.55')
