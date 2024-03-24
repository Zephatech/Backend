import axios, { AxiosResponse } from 'axios'
import { AI_HOST_URL } from './common'

export const imageToText = async (path: String) => {
  if (true) {
    return 'This is a test description.'
  }
  let relativePathHardCode =
    '/Users/ryandeng/Documents/Coding/uw-trade/public/images'
  try {
    const response: AxiosResponse<any, any> = await axios.post(
      `${AI_HOST_URL}/image_to_text`,
      { path: `${relativePathHardCode}/${path}` }
    )
    const result = await response.data

    return result
  } catch (error) {
    console.log(error)
  }
}
