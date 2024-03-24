import axios, { AxiosResponse } from 'axios'
import { enable_AI_text_checker } from '../featureFlags'
import { AI_HOST_URL } from './common'

export const isContentToxic = async (content: String) => {
  if (enable_AI_text_checker == false) {
    return false
  }
  try {
    const response: AxiosResponse<any, any> = await axios.post(
      `${AI_HOST_URL}/predict`,
      { text: `${content}` }
    )
    const result = await response.data.result

    if (result == 'Toxic') {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}
