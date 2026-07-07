import axios from "axios"


// const getItems = async () => {
//     const response = await axios.get(
//         "https://api.getjaz.com/api/v1/items",
//         {
//             headers: {
//                 "x-jk-api-key": process.env.JAZ_API_KEY,
//                 "accept": "application/json",
//             },
//             params: {
//                 limit: 1000,
//                 offset: 0,
//                 view: "lean",
//             },
//         }
//     );

//     return response.data.data.map((item) => ({
//         id: item.resourceId,
//         name: item.name || item.internalName,
//         code: item.itemCode,
//     }));
// };



const getItems = async (apiKey) => {
    let allItems = [];
    let offset = 0;
    const limit = 1000; 

    
    
    while (true) {
        const response = await axios.get(
            "https://api.getjaz.com/api/v1/items",
            {
                headers: {
                    "x-jk-api-key": apiKey,
                    "accept": "application/json",
                },
                params: {
                    limit: 1000,
                    offset: 0,
                    view: "lean",
                },
            }
        );

        const records = response.data?.data || [];

        console.log("records.length", records.length)

        allItem.push(...records);

        console.log(
            `Fetched ${records.length} records at offset ${offset}`
        );


        if (records.length < limit) {
            break;
        }

        offset += 1;
    }

    return allItem

};



export default getItems