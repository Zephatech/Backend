import axios, { AxiosResponse } from 'axios';
import { enable_AI_text_checker } from '../featureFlags';

export const isContentToxic = async (content: String) => {
  if(enable_AI_text_checker == false){
    return false
  }
  try {
    const response: AxiosResponse<any, any> = await axios.post('http://127.0.0.1:5000/predict', {text: `${content}`});
    const result = await response.data.result

    if (result == "Toxic") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error)
  }

}