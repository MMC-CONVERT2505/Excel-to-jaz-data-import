import axios from "axios"


// const getCustomerCreditNotes = async () => {
//     try {
//         const { data } = await axios.get(
//             "https://api.getjaz.com/api/v1/customer-credit-notes",
//             {
//                 headers: {
//                     "x-jk-api-key": process.env.JAZ_API_KEY,
//                     accept: "application/json",
//                 },
//                 params: {
//                     limit: 1000,
//                     offset: 0,
//                     view: "full",
//                 },
//             }
//         );

//         return (data.data || []).map((credit) => ({
//             id: credit.resourceId,
//             reference: credit.reference,
//             status: credit.status,
//             valueDate: credit.valueDate,
//             supplierId: credit.contactResourceId,
//             totalAmount: credit.totalAmount,
//         }));
//     } catch (error) {
//         console.error(
//             error.response?.data || error.message
//         );
//         return [];
//     }
// }; 


const getCustomerCreditNotes = async (apiKey) => {
    let allCustomerCreditNote = [];
    let offset = 0;
    const limit = 1000; 
 

    while (true) {
       const response = await axios.get(
            "https://api.getjaz.com/api/v1/customer-credit-notes",
            {
                headers: {
                    "x-jk-api-key": apiKey,
                    accept: "application/json",
                },
                params: {
                    limit: 1000,
                    offset: 0,
                    view: "full",
                },
            }
       )

        const records = response.data?.data || [];

        console.log("records.length", records.length)

        allCustomerCreditNote.push(...records);

        console.log(
            `Fetched ${records.length} records at offset ${offset}`
        );


        if (records.length < limit) {
            break;
        }

        offset += 1;
    }

    return allCustomerCreditNote
};



export default getCustomerCreditNotes