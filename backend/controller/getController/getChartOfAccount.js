import axios from "axios"


// const getChartOfAccounts = async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://api.getjaz.com/api/v1/chart-of-accounts",
//       {
//         params: {
//           limit: 1000,
//           offset: 0,
//         },
//         headers: {
//           "x-jk-api-key":
//             process.env.JAZ_API_KEY,
//           Accept:
//             "application/json",
//         },
//       }
//     );

//     // console.log(
//     //   "Chart Of Accounts:",
//     //   JSON.stringify(
//     //     response.data,
//     //     null,
//     //     2
//     //   )
//     // );

//     const data = response.data?.data

//     return data



//   } catch (error) {

//     return  error.response?.data || error.message
//   }
// };


const getChartOfAccounts = async (apiKey) => {
  let allAccounts = [];
  let offset = 0;
  const limit = 1000;


  while (true) {
    const response = await axios.get(
      "https://api.getjaz.com/api/v1/chart-of-accounts",
      {
        params: {
          limit,
          offset,
        },
        headers: {
          "x-jk-api-key": apiKey,
          Accept: "application/json",
        },
      }
    );

    const records = response.data?.data || [];

    console.log("records.length", records.length)

    allAccounts.push(...records);

    console.log(
      `Fetched ${records.length} records at offset ${offset}`
    );


    if (records.length < limit) {
      break;
    }

    offset += 1;
  }

  return allAccounts
};




export default getChartOfAccounts