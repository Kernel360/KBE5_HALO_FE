import axios from '@/services/axios'

export const googleOAuthLogin = async (role: 'customer' | 'manager', code: string) => {
  const endpoint = role === 'manager' ? '/managers/auth/google' : '/customers/auth/google'
  return axios.post(endpoint, { code })
} 