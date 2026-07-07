import axios from "axios"

// const getBankAccounts = async (req, res) => {
//     try {
//         const response = await axios.get(
//             "https://api.getjaz.com/api/v1/bank-accounts",
//             {
//                 params: {
//                     limit: 1000,
//                     offset: 0,
//                 },
//                 headers: {
//                     accept: "application/json",
//                     "x-jk-api-key": process.env.JAZ_API_KEY,
//                 },
//             }
//         );

//         // return res.status(200).json({
//         //     success: true,
//         //     data: response.data,
//         // });


//         return response.data

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message:
//                 error.response?.data || error.message,
//         });
//     }
// };





const getBankAccounts = async (apiKey) => {
    let allBankAccounts = [];
    let offset = 0;
    const limit = 1000;


    while (true) {
        const response = await axios.get(
            "https://api.getjaz.com/api/v1/bank-accounts",
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

        const records = response?.data || [];

          console.log("records.length", records.length)
        allBankAccounts.push(...records);

        console.log(
            `Fetched ${records.length} records at offset ${offset}`
        );


        if (records.length < limit) {
            break;
        }

        offset += 1;
    }



    return allBankAccounts
};



export default getBankAccounts