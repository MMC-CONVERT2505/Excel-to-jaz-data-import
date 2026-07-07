import axios from "axios"

// const getCustomer = async (req, res) => {
//   try {
//     const response = await axios.get(
//       "https://api.getjaz.com/api/v1/contacts?limit=1000&view=full",
//       {
//         headers: {
//           Accept: "application/json",
//           "x-jk-api-key": process.env.JAZ_API_KEY,
//         },
//       }
//     );

//     const contacts = response.data?.data || response.data || [];

//     const customers = contacts.filter(
//       (contact) =>
//         contact.isCustomer === true ||
//         contact.customer === true ||
//         contact.contactType === "customer"
//     );

//     // return res.status(200).json({
//     //   success: true,
//     //   count: customers.length,
//     //   data: customers,
//     // });


//     return customers

//   } catch (error) {
//     return error.response?.data || error.message
// };

// }




const getCustomer = async (apiKey) => {
  let allCustomer = [];
  let offset = 0;
  const limit = 1000;


  while (true) {
    const response = await axios.get(
      "https://api.getjaz.com/api/v1/contacts",
      {
        params: {
          limit,
          offset,
          view:"full"
        },
        headers: {
          "x-jk-api-key": apiKey,
          Accept: "application/json",
        },
      }
    );


    const contacts = response.data?.data || response.data || [];

    const customers = contacts.filter(
      (contact) =>
        contact.isCustomer === true ||
        contact.customer === true ||
        contact.contactType === "customer"
    );

    const records = customers

    console.log("records.length", records.length)

    allCustomer.push(...records);

    console.log(
      `Fetched ${records.length} records at offset ${offset}`
    );


    if (records.length < limit) {
      break;
    }

    offset += 1;
  }

  return allCustomer

}


export default getCustomer