import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getBills from "./getController/getBill.js";
import getAccounts from "./getController/getChartOfAccount.js"

// ADD Bill Payment

const excelDateToJSDate = (excelDate) => {
    if (!excelDate) return null;

    const date = new Date(
        (excelDate - 25569) *
        86400 *
        1000
    );

    return date
        .toISOString()
        .split("T")[0];
};

// full working code 


// const createBillPayment = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "billPayment.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData =
//             XLSX.utils.sheet_to_json(worksheet);

//         const results = [];

//         for (const row of excelData) {
//             try {
//                 console.log("row =>", row);

//                 const billResourceId = row["invid"]
//                     ?.toString()
//                     .trim();

//                 if (!billResourceId) {
//                     results.push({
//                         status: "failed",
//                         reference:
//                             row["reference"],
//                         error: "Missing Bill Resource Id",
//                     });
//                     continue;
//                 }

//                 const payload = {
//                     reference: row["reference"]
//                         ?.toString()
//                         .trim(),

//                     valueDate:
//                         excelDateToJSDate(
//                             row["valuedate"]
//                         ),

//                     paymentMethod:
//                         row["paymethod"]
//                             ?.toString()
//                             .trim(),

//                     accountResourceId:
//                         row[
//                             "accountResourceId"
//                         ]
//                             ?.toString()
//                             .trim(),

//                     paymentAmount: Number(
//                         row[
//                         "paymentAmount"
//                         ] || 0
//                     ),

//                     transactionAmount:
//                         Number(
//                             row[
//                             "transactionAmount"
//                             ] || 0
//                         ),

//                     saveAsDraft:
//                         row[
//                         "saveas draft"
//                         ] === true,

//                     ...(row["Currency"] && {
//                         currency: {
//                             sourceCurrency:
//                                 row[
//                                     "Currency"
//                                 ]
//                                     .toString()
//                                     .trim(),

//                             exchangeRate:
//                                 Number(
//                                     row[
//                                     "exchangerate"
//                                     ] || 1
//                                 ),
//                         },
//                     }),
//                 };

//                 console.log(
//                     "Bill Resource Id =>",
//                     billResourceId
//                 );

//                 console.log(
//                     "Payload =>",
//                     JSON.stringify(
//                         payload,
//                         null,
//                         2
//                     )
//                 );

//                 // const response =
//                 //     await axios.post(
//                 //         `https://api.getjaz.com/api/v1/bills/${billResourceId}/payments`,
//                 //         payload,
//                 //         {
//                 //             headers: {
//                 //                 "x-jk-api-key":
//                 //                     process
//                 //                         .env
//                 //                         .JAZ_API_KEY,
//                 //                 "Content-Type":
//                 //                     "application/json",
//                 //                 Accept:
//                 //                     "application/json",
//                 //             },
//                 //         }
//                 //     );

//                 results.push({
//                     status: "success",
//                     billResourceId,
//                     data:
//                         response.data,
//                 });
//             } catch (error) {
//                 results.push({
//                     status: "failed",
//                     billResourceId:
//                         row["invid"],
//                     reference:
//                         row["reference"],
//                     error:
//                         error.response
//                             ?.data ||
//                         error.message,
//                 });
//             }
//         }


//         return res.status(200).json({
//             success: true,
//             totalRows:
//                 excelData.length,
//             results,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message:
//                 error.message,
//         });
//     }
// };


// id working code 


const createBillPayment = async (req, res) => {
    try {
        // const filePath = path.join(
        //     process.cwd(),
        //     "files",
        //     "billPayment.xlsx"
        // );


        const { apiKey } = req.body

        console.log("apikey", apiKey)

        // const workbook = XLSX.readFile(filePath);
        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer",
        });

        const worksheet =
            workbook.Sheets[
            workbook.SheetNames[0]
            ];

        const excelData =
            XLSX.utils.sheet_to_json(
                worksheet
            );

        const coa =
            await getAccounts(apiKey);

        const bills =
            await getBills(apiKey); 

        console.log("bills", bills)

        const results = [];


        for (const row of excelData) {
            console.log("row", row)
            try {
                const billName =
                    row["bills name"]
                        ?.toString()
                        .trim();

                const accountName =
                    row["account name"]
                        ?.toString()
                        .trim();

                if (!billName) {
                    results.push({
                        status: "failed",
                        reference:
                            row["reference"],
                        error:
                            "Bill Name Missing",
                    });
                    continue;
                }

                if (!accountName) {
                    results.push({
                        status: "failed",
                        reference:
                            row["reference"],
                        error:
                            "Account Name Missing",
                    });
                    continue;
                }

                // Bill Mapping
                const bill =
                    bills.find(
                        (b) =>
                            b.name
                                ?.toString()
                                .trim()
                                .toLowerCase() ===
                            billName
                                .toLowerCase()
                    );

                if (!bill) {
                    results.push({
                        status: "failed",
                        billName,
                        error:
                            "Bill not found",
                    });
                    continue;
                }

                // COA Mapping
                const account =
                    coa.find(
                        (a) =>
                            a.name
                                ?.toString()
                                .trim()
                                .toLowerCase() ===
                            accountName.toLowerCase()
                    );

                if (!account) {
                    results.push({
                        status: "failed",
                        accountName,
                        error:
                            "Account not found",
                    });
                    continue;
                }

                const billResourceId =
                    bill.resourceId;

                const accountResourceId =
                    account.resourceId;

                const payload = {
                    reference:
                        row["reference"]
                            ?.toString()
                            .trim() || row["reference*"]
                                ?.toString()
                                .trim(),

                    valueDate:
                        excelDateToJSDate(
                            row["valuedate*"]
                        ),

                    paymentMethod:
                        row["paymethod*"]
                            ?.toString()
                            .trim(),

                    accountResourceId,

                    paymentAmount:
                        Number(
                            row[
                            "paymentAmount*"
                            ] || 0
                        ),

                    transactionAmount:
                        Number(
                            row[
                            "transactionAmount*"
                            ] || 0
                        ),

                    saveAsDraft:
                        row[
                        "saves draft*"
                        ] === true,

                    ...(row[
                        "Currency"
                    ] && {
                        currency: {
                            sourceCurrency:
                                row[
                                    "Currency"
                                ]
                                    .toString()
                                    .trim(),

                            exchangeRate:
                                Number(
                                    row[
                                    "exchangerate"
                                    ] || 1
                                ),
                        },
                    }),
                };

                console.log(
                    "Bill Name =>",
                    billName
                );

                console.log(
                    "Bill ResourceId =>",
                    billResourceId
                );

                console.log(
                    "Account Name =>",
                    accountName
                );

                console.log(
                    "Account ResourceId =>",
                    accountResourceId
                );

                console.log(
                    "Payload =>",
                    JSON.stringify(
                        payload,
                        null,
                        2
                    )
                );

                const response =
                    await axios.post(
                        `https://api.getjaz.com/api/v1/bills/${billResourceId}/payments`,
                        payload,
                        {
                            headers: {
                                "x-jk-api-key":
                                    apiKey,
                                "Content-Type":
                                    "application/json",
                                Accept:
                                    "application/json",
                            },
                        }
                    );

                results.push({
                    status:
                        "success",
                    billName: String(row["bills name"]),
                    data:
                        response.data,
                });
            } catch (error) {
                results.push({
                    status:
                        "failed",
                    billName: String(row["bills name"]),
                    error:
                        error.response
                            ?.data ||
                        error.message,
                });
            }
        }

        return res.status(200).json({
            success: true,
            totalRecords:
                excelData.length,
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
            error:
                error.message,
        });
    }
};


const billPayment = { createBillPayment }

export default billPayment