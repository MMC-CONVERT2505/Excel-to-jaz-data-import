import axios from "axios"


// const getSupplierCreditNotes = async () => {
//     try {
//         const { data } = await axios.get(
//             "https://api.getjaz.com/api/v1/supplier-credit-notes",
//             {
//                 headers: {
//                     "x-jk-api-key": process.env.JAZ_API_KEY,
//                     accept: "application/json",
//                 },
//                 params: {
//                     limit: 1000,
//                     offset: 0,
//                     view: "lean",
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


const getSupplierCreditNotes = async (apiKey) => {
    let allSupplierCreditNotes = [];
    let offset = 0;
    const limit = 1000; 


    while (true) {
        const { data } = await axios.get(
            "https://api.getjaz.com/api/v1/supplier-credit-notes",
            {
                headers: {
                    "x-jk-api-key": apiKey,
                    accept: "application/json",
                },
                params: {
                    limit: 1000,
                    offset: 0,
                    view: "lean",
                },
            }
        );

        const records = (data.data || []).map((credit) => ({
            id: credit.resourceId,
            reference: credit.reference,
            status: credit.status,
            valueDate: credit.valueDate,
            supplierId: credit.contactResourceId,
            totalAmount: credit.totalAmount,
        }));


        console.log("records.length", records.length)

        allSupplierCreditNotes.push(...records);

        console.log(
            `Fetched ${records.length} records at offset ${offset}`
        );


        if (records.length < limit) {
            break;
        }

        offset += 1;
    }

    return allSupplierCreditNotes
};



export default getSupplierCreditNotes