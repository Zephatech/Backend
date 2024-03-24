import axios, { AxiosResponse } from 'axios'
import { enable_AI_text_checker } from '../featureFlags'
import { AI_HOST_URL } from './common'

export const isImageToxic = async (path: String) => {
  if (true) {
    return false
  }
  let relativePathHardCode =
    '/Users/ryandeng/Documents/Coding/uw-trade/public/images'
  try {
    const response: AxiosResponse<any, any> = await axios.post(
      `${AI_HOST_URL}/predict_image`,
      { path: `${relativePathHardCode}/${path}` }
    )
    const result = await response.data.result

    if (result == 'Toxic') {
      return true
    } else if (result == 'Need further review') {
      return false
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}
