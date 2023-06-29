import axios, { AxiosResponse } from 'axios';

export const sensitiveTextChecker = async (content: String) => {
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