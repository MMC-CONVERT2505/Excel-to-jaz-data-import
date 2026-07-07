import axios from "axios"

// const getSuppliers = async (req, res) => {
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

//     const suppliers = contacts.filter(
//       (contact) =>
//         contact.isSupplier === true ||
//         contact.supplier === true ||
//         contact.contactType === "supplier"
//     );


//     return suppliers



//   } catch (error) {
//     return error.response?.data || error.message
//   }
// };



const getSuppliers = async (apiKey) => {
  let allSuppliers = [];
  let offset = 0;
  const limit = 1000; 

  

  while (true) {
    const response = await axios.get(
      "https://api.getjaz.com/api/v1/contacts",
      {

        params: {
          limit,
          offset,
          view:'full'
        },
        headers: {
          Accept: "application/json",
          "x-jk-api-key": apiKey,
        },
      }
    );

    const contacts = response.data?.data || response.data || [];

    const suppliers = contacts.filter(
      (contact) =>
        contact.isSupplier === true ||
        contact.supplier === true ||
        contact.contactType === "supplier"
    );


    const records = suppliers

    console.log("records.length", records.length)

    allSuppliers.push(...records);

    console.log(
      `Fetched ${records.length} records at offset ${offset}`
    );


    if (records.length < limit) {
      break;
    }

    offset += 1;
  }

  return allSuppliers
};


export default getSuppliers