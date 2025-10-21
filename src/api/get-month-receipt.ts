import { api } from '@/lib/axios'

export interface GetMonthReceiptResponse {
  receipt: number
  diffFromLastMonth: number
}

export async function getMonthReceipt() {
  const response = await api.get<GetMonthReceiptResponse>(
    '/metrics/month-receipt',
    {
      withCredentials: true,
    }
  )

  return response.data
}
