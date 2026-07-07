import axios from "axios";

// const getInvoices = async (req, res) => {
//     try {
//         const response = await axios.get(
//             // "https://api.getjaz.com/api/v1/bills",
//             'https://api.getjaz.com/api/v1/invoices',
//             {
//                 params: {
//                     limit: 1000,
//                     view: "full",
//                 },
//                 headers: {
//                     accept: "application/json",
//                     "x-jk-api-key": process.env.JAZ_API_KEY,
//                 },
//             }
//         );

//         // const result = response.data.data.map(invoice => ({
//         //     invoiceName: invoice.contact?.billingName || invoice.contact?.name,
//         //     reference: invoice.reference,
//         //     resourceId: invoice.resourceId
//         // }));

//         // return res.status(200).json({
//         //     success: true,
//         //     count: response.data?.data?.length || 0,
//         //     data: result,
//         // });


//         return response?.data?.data

//     } catch (error) {
//         console.error(
//             "Get invoice Error:",
//             error.response?.data || error.message
//         );

//         return res.status(
//             error.response?.status || 500
//         ).json({
//             success: false,
//             error:
//                 error.response?.data ||
//                 error.message,
//         });
//     }
// };



const getInvoices = async (apiKey) => {
    let allInvoice = [];
    let offset = 0;
    const limit = 1000; 

    
  
    while (true) {
        const response = await axios.get(
            'https://api.getjaz.com/api/v1/invoices',
            {
                params: {
                    limit,
                    offset,
                    view: "full",
                },
                headers: {
                    accept: "application/json",
                    "x-jk-api-key": apiKey,
                },
            }
        );

        const records = response.data?.data || [];

        console.log("records.length", records.length)

        allInvoice.push(...records);

        console.log(
            `Fetched ${records.length} records at offset ${offset}`
        );


        if (records.length < limit) {
            break;
        }

        offset += 1;
    }


    const result = allInvoice.map((item) => ({
        name: item?.reference,
        resourceId: item?.resourceId,
    }));

    return result
};

export default getInvoices;

