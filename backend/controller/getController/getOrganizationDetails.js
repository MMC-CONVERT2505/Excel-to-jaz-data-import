
import axios from "axios";

const getOrganizationDetails = async (req, res) => { 

  try {

    const { apiKey } = req.query;

    console.log("API Key:", apiKey);

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: "API key is required",
      });
    }

    const response = await axios.get(
      "https://api.getjaz.com/api/v1/organization",
      {
        headers: {
          "x-jk-api-key": apiKey,
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      success: true,
      name: response.data.data.name,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
};

export default getOrganizationDetails;