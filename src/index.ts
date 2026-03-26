import { parseEnv } from 'node:util'


type Lang = 'en' | 'ru'

interface TwoIP {
  auth: string
  lang?: Lang
}

const BASE_API_URL = 'https://api.2ip.io'

/*
*/

const getTokenQueryParam = (token: string) => {
  return `?token=${token}`
}

const getLangQueryParam = (lang?: Lang) => {
  return lang ? `&lang=${lang}` : ''
}

export function twoip({ auth, lang }: TwoIP) {
  const tokenParam = getTokenQueryParam(auth)
  const langParam = getLangQueryParam(lang)

  const ipInfo = (ip?: string) => {
    const ipEndpoint = ip ? ip : ''

    console.log(`${BASE_API_URL}/${ipEndpoint}${tokenParam}${langParam}`)
  }

  return { ipInfo }
}


if (!process.env.TSDOWN_TOKEN) {
  throw new Error('TSDOWN_TOKEN не указан в .env');
}


const fetch2ip = twoip({ auth: process.env.TSDOWN_TOKEN })

fetch2ip.ipInfo()
fetch2ip.ipInfo('127.0.0.1')
console.log('hi');
