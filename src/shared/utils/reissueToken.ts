import api from '@/services/axios'

export const reissueToken = async () => {
  const res = await api.post('/reissue')

  const rawHeader = res.headers['authorization']
  const accessToken = rawHeader?.replace('Bearer ', '').trim()

  return accessToken
}
