import axios, { AxiosResponse } from 'axios';
import { enable_AI_text_checker } from '../featureFlags';

export const isContentToxic = async (content: String) => {
  if(enable_AI_text_checker == false){
    return false
  }

  const data = {
    text: `${content}`
  }

  console.log(data)
  console.log(JSON.stringify(data))
  try {
    const response: AxiosResponse<any, any> = await axios.post('http://localhost:5000/predict', {text: `${content}`});

    console.log(response.data.result)
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