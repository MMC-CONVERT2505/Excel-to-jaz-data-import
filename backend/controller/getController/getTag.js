import axios from "axios"

// const getTags = async () => {
//     try {
//         const { data } = await axios.get(
//             "https://api.getjaz.com/api/v1/tags",
//             {
//                 headers: {
//                     "x-jk-api-key": process.env.JAZ_API_KEY,
//                     accept: "application/json",
//                 },
//                 params: {
//                     limit: 1000,
//                     offset: 0,
//                 },
//             }
//         );

//         return (data.data || []).map((tag) => ({
//             id: tag.resourceId,
//             name: tag.name,
//         }));
//     } catch (error) {
//         console.error(
//             error.response?.data || error.message
//         );
//         return [];
//     }
// };



const getTags = async (apiKey) => {
    let allTags = [];
    let offset = 0;
    const limit = 1000; 

     

    while (true) {
        const response = await axios.get(
            "https://api.getjaz.com/api/v1/tags",
            {
                headers: {
                    "x-jk-api-key": apiKey,
                    accept: "application/json",
                },
                params: {
                    limit: 1000,
                    offset: 0,
                },
            }
        );

        const records = response.data?.data || [];

        console.log("records.length", records.length)

        allTags.push(...records);

        console.log(
            `Fetched ${records.length} records at offset ${offset}`
        );


        if (records.length < limit) {
            break;
        }

        offset += 1;
    }

    return allTags
};

export default getTags