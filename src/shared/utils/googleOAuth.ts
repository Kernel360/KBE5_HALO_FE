import axios from '@/services/axios'

export const googleOAuthLogin = async (role: 'customers' | 'managers', code: string) => {
  const endpoint = role === 'managers' ? '/managers/auth/google' : '/customers/auth/google'
  return axios.post(endpoint, { code })
} 