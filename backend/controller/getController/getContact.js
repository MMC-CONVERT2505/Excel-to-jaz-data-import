import axios from "axios"

const getContacts = async (apiKey) => {
  try {
    const response = await axios.get(
      "https://api.getjaz.com/api/v1/contacts?limit=1000&view=full",
      {
        headers: {
          Accept: "application/json",
          "x-jk-api-key": apiKey,
        },
      }
    );

    const contacts = response.data?.data || response.data || [];



    return contacts

  } catch (error) {
    return error.response?.data || error.message
  }
};


export default getContacts