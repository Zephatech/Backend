import axios, { AxiosResponse } from 'axios';

export const imageToText = async (path: String) => {
  let relativePathHardCode = '/Users/ryandeng/Documents/Coding/uw-trade/public/images'
  try {
    const response: AxiosResponse<any, any> = await axios.post('http://127.0.0.1:5000/image_to_text', {path: `${relativePathHardCode}/${path}`});
    const result = await response.data
    
    return result
  } catch (error) {
    console.log(error)
  }
};
