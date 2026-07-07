import axios from "axios"

// const getBills = async () => {
//     try {
//         const { data } = await axios.get(
//             "https://api.getjaz.com/api/v1/bills",
//             {
//                 headers: {
//                     "x-jk-api-key": process.env.JAZ_API_KEY,
//                     accept: "application/json",
//                 },
//                 params: {
//                     limit: 1000,
//                     view: "lean",
//                 },
//             }
//         );

//         return data?.data

//     } catch (error) {
//         console.error(
//             error.response?.data || error.message
//         );
//         return [];
//     }
// };


const getBills = async (apiKey) => {
    let allBills = [];
    let offset = 0;
    const limit = 1000;


    while (true) {
        const response = await axios.get(
            "https://api.getjaz.com/api/v1/bills",
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

        allBills.push(...records);

        console.log(
            `Fetched ${records.length} records at offset ${offset}`
        );


        if (records.length < limit) {
            break;
        }

        offset += 1;
    }

    // console.log("Bills", allBills)

    const result = allBills.map((item) => ({
        name: item?.reference,
        resourceId: item?.resourceId,
    }));

    return result
};



export default getBills