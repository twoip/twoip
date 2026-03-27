type Lang = 'en' | 'ru'

interface TwoIP {
  token: string
}

interface ApiUrl {
  token: string
  service: keyof typeof endpoints
  target?: string
  lang?: Lang
  page?: number
}

type IpInfo = {
  ip?: string
  lang?: Lang
}

type Email = {
  email: string
}

type AbuseReportByIp = { ip: string }
type AbuseReportByDomain = { domain: string }
type AbuseReports = AbuseReportByIp | AbuseReportByDomain

const endpoints = {
  info: '',
  whois: 'whois',
  abuses: 'abuses',
  domains: 'domains',
  email: 'email',
  asn: 'asn',
} as const

function buildApiUrl({ service, target, token, lang, page }: ApiUrl): string {
  const baseUrl = 'https://api.2ip.io'
  const path = [endpoints[service], target].filter(Boolean).join('/')
  console.log(target, path)

  const url = new URL(`${baseUrl}/${path}`)

  url.searchParams.set('token', token)
  if (lang) {
    url.searchParams.set('lang', lang)
  }
  if (page) {
    url.searchParams.set('page', String(page))
  }

  return url.toString()
}

async function fetchApi(url: string) {
  console.log(url)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(
        `HTTP status: ${response.status} - ${response.statusText}`,
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

export function twoip({ token }: TwoIP) {
  const getIpInfo = async ({ ip, lang }: IpInfo = {}) => {
    const url = buildApiUrl({ service: 'info', target: ip, token, lang })
    return await fetchApi(url)
  }

  const checkEmail = async ({ email }: Email) => {
    const url = buildApiUrl({ service: 'email', target: email, token })
    return await fetchApi(url)
  }

  const getAbuseReports = async (params : AbuseReports) => {
    // TODO: затащить zod. если params.ip валидировать как ip, если params.domain валидировать как домен
    const address = 'ip' in params ? params.ip : params.domain
    const url = buildApiUrl({ service: 'abuses', target: address, token })
    return await fetchApi(url)
  }

  //getDomainsByIp(ip, page?)
  //getAsnInfo(asnId, lang?)
  //getWhoisInfo(ip)

  return { getIpInfo, checkEmail, getAbuseReports }
}

if (!process.env.TSDOWN_TOKEN) {
  throw new Error('TSDOWN_TOKEN not found in .env')
}

const { checkEmail, getIpInfo, getAbuseReports } = twoip({ token: process.env.TSDOWN_TOKEN })

//console.log(await checkEmail({ email: 'dev@2ip.io' }))
//console.log(await getIpInfo({ ip: '138.249.149.55', lang: 'ru' }))
console.log(await getAbuseReports({ domain: 'facebook.com' }))
