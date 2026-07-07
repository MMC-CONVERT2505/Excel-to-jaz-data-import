import axios from "axios"

// const getTaxProfiles = async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://api.getjaz.com/api/v1/tax-profiles",
//       {
//         params: {
//           limit: 1000,
//           offset: 0,
//         },
//         headers: {
//           "x-jk-api-key": process.env.JAZ_API_KEY,
//           "accept": "application/json",
//         },
//       }
//     );


//     const taxProfiles = (response.data?.data || []).map((item) => ({
//       name: item.name,
//       vatValue: item.vatValue,
//       resourceId: item.resourceId,
//     }));

//     return taxProfiles


//   } catch (error) {
//     return error.response?.data || error.message
//   }
// };



const getTaxProfiles = async (apiKey) => {
  let allTaxes = [];
  let offset = 0;
  const limit = 1000;


  while (true) {

    const response = await axios.get(
      "https://api.getjaz.com/api/v1/tax-profiles",
      {
        params: {
          limit: 1000,
          offset: 0,
        },
        headers: {
          "x-jk-api-key": apiKey,
          "accept": "application/json",
        },
      }
    );

    const records = response.data?.data || [];

    console.log("records.length", records.length)

    allTaxes.push(...records);

    console.log(
      `Fetched ${records.length} records at offset ${offset}`
    );


    if (records.length < limit) {
      break;
    }

    offset += 1;
  }

  return allTaxes
};



export default getTaxProfiles