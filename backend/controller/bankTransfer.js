import axios from "axios";
import XLSX from "xlsx";
import path from "path";

import getAccounts from "./getController/getChartOfAccount.js"



// ADD Bank Transfer

const excelDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;

    return new Date(utcValue * 1000)
        .toISOString()
        .split("T")[0];
};

// working 

// const createBankTransefer = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "banktransfer.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData = XLSX.utils.sheet_to_json(
//             worksheet
//         );

//         const results = [];

//         for (const row of excelData) {
//             console.log("row", row)
//             try {
//                 const payload = {
//                     reference: row.reference,
//                     valueDate: excelDateToJSDate(
//                         row.valueDate
//                     ),
//                     saveAsDraft: Boolean(
//                         row.saveAsDraft
//                     ),

//                     cashIn: {
//                         accountResourceId:
//                             row[
//                                 "cashinaccount-accountResourceId"
//                             ],
//                         amount: Number(
//                             row["Cash inamount"]
//                         ),
//                     },

//                     cashOut: {
//                         accountResourceId:
//                             row[
//                                 "cashoutaccount-accountResourceId"
//                             ],
//                         amount: Number(
//                             row["Cashout amount"]
//                         ),
//                     },
//                 };

//                 console.log(
//                     "Payload:",
//                     JSON.stringify(payload, null, 2)
//                 );

//                 const response = await axios.post(
//                     "https://api.getjaz.com/api/v1/cash-transfers",
//                     payload,
//                     {
//                         headers: {
//                             "x-jk-api-key":
//                                 process.env.JAZ_API_KEY,
//                             "Content-Type":
//                                 "application/json",
//                         },
//                     }
//                 );

//                 results.push({
//                     reference: row.reference,
//                     success: true,
//                     data: response.data,
//                 });
//             } catch (error) {
//                 console.log(
//                     `Error for ${row.reference}`,
//                     error.response?.data ||
//                         error.message
//                 );

//                 results.push({
//                     reference: row.reference,
//                     success: false,
//                     error:
//                         error.response?.data ||
//                         error.message,
//                 });
//             }
//         }

//         return res.status(201).json({
//             success: true,
//             total: results.length,
//             data: results,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }; 


// id full working 
const createBankTransefer = async (req, res) => {
    try {
        // const filePath = path.join(
        //     process.cwd(),
        //     "files",
        //     "banktransfer.xlsx"
        // );

        const { apiKey } = req.body

        console.log("apikey", apiKey)

        // const workbook = XLSX.readFile(filePath);
        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer",
        });



        const worksheet =
            workbook.Sheets[workbook.SheetNames[0]];

        const excelData =
            XLSX.utils.sheet_to_json(worksheet);

        // Fetch COA once
        const coaList = await getAccounts(apiKey);


        const results = [];

        for (const row of excelData) {
            console.log("row", row)
            try {
                const normalize = (str) =>
                    str?.replace(/\s+/g, " ").trim().toLowerCase();

                const cashInAccountName = row["cashInAccount name"];
                const cashOutAccountName = row["cashOutAccount name"];

                const cashInAccount = coaList.find(
                    (acc) => normalize(acc.name) === normalize(cashInAccountName)
                );

                const cashOutAccount = coaList.find(
                    (acc) => normalize(acc.name) === normalize(cashOutAccountName)
                );



                if (!cashInAccount) {
                    console.log(`Cash In Account not found: ${cashInAccountName}`)
                }

                if (!cashOutAccount) {
                    console.log(`Cash Out Account not found: ${cashOutAccountName}`)
                }


                const payload = {
                    reference:
                        row["reference*"] != null
                            ? String(row["reference*"]).replace(/\*/g, "").trim()
                            : "",
                    valueDate: excelDateToJSDate(
                        row.valueDate
                    ),
                    saveAsDraft:
                        String(
                            row["saveAsDraft*"]
                        ).toLowerCase() === "true",

                    cashIn: {
                        accountResourceId:
                            cashInAccount.resourceId,
                        amount: Number(
                            row["Cash inamount"]
                        ),
                    },

                    cashOut: {
                        accountResourceId:
                            cashOutAccount.resourceId,
                        amount: Number(
                            row["Cashout amount"]
                        ),
                    },
                };

                console.log(
                    "Payload:",
                    JSON.stringify(payload, null, 2)
                );

                const response = await axios.post(
                    "https://api.getjaz.com/api/v1/cash-transfers",
                    payload,
                    {
                        headers: {
                            "x-jk-api-key":
                               apiKey,
                            "Content-Type":
                                "application/json",
                        },
                    }
                );

                results.push({
                    reference: payload.reference,
                    status: "success",
                    data: response.data,
                });
            } catch (error) {
                console.log(
                    `Error for ${row["reference*"]}`,
                    error.response?.data ||
                    error.message
                );

                results.push({
                    reference: row["reference*"],
                    status: "failed",
                    error:
                        error.response?.data ||
                        error.message,
                });
            }
        }

        return res.status(201).json({
            success: true,
            totalRecords: results.length,
            successCount: results.filter(
                (r) => r.status === "success"
            ).length,
            failedCount: results.filter(
                (r) => r.status === "failed"
            ).length,
            results,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};






const bankTransefer = { createBankTransefer }

export default bankTransefer
