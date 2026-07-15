import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getAccount from "./getController/getChartOfAccount.js"
import getCustomer from "./getController/getCustomer.js"
import getBankAccounts from "./getController/getBankAccounts.js";
import getTaxProfiles from "./getController/getTax.js";



// ADD CASH UP

const excelDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;

    return new Date(utcValue * 1000)
        .toISOString()
        .split("T")[0];
};


// full working code 

// const createCashIn = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "rmtestingfile.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData =
//             XLSX.utils.sheet_to_json(worksheet);

//         // Group rows by reference
//         const groupedData = {};

//         // for (const row of excelData) {
//         //     const reference = row["reference*"];

//         //     if (!groupedData[reference]) {
//         //         groupedData[reference] = {
//         //             reference,
//         //             valueDate: excelDateToJSDate(
//         //                 row["valueDate*"]
//         //             ),
//         //             accountResourceId:
//         //                 row["Bankaccountid*"],
//         //             saveAsDraft:
//         //                 row["saveAsDraft*"] ?? false,
//         //             taxVatApplicable:
//         //                 row["taxVatApplicable"] ?? false,
//         //             lines: []
//         //         };
//         //     }

//         //     groupedData[reference].lines.push({
//         //         accountResourceId:
//         //             row["accountResourceId*"],
//         //         amount:
//         //             Number(row["amount"]) || 0,
//         //         description:
//         //             row["description"] || ""
//         //     });
//         // }

//         for (const row of excelData) {
//             console.log("row", row)
//             // const reference = row["reference*"];
//             const reference = row["reference*"] != null ? String(row["reference*"]) : "";

//             if (!groupedData[reference]) {
//                 groupedData[reference] = {
//                     reference,
//                     valueDate: excelDateToJSDate(
//                         row["valueDate*"]
//                     ),
//                     accountResourceId:
//                         row["Bankaccountid*"],
//                     saveAsDraft:
//                         String(row["saveAsDraft*"] || "")
//                             .trim()
//                             .toUpperCase() === "TRUE",

//                     taxVatApplicable:
//                         String(row["taxVatApplicable"] || "")
//                             .trim()
//                             .toUpperCase() === "TRUE",
//                     ...(row["currency"] && {
//                         currency: {
//                             sourceCurrency:
//                                 row["currency"]
//                                     .toString()
//                                     .trim(),

//                             ...(row["Exchangerate"] && {
//                                 exchangeRate: Number(
//                                     row["Exchangerate"]
//                                 ),
//                             }),
//                         },
//                     }),
//                     lines: []
//                 };
//             }

//             groupedData[reference].lines.push({
//                 accountResourceId:
//                     row["accountResourceId*"],
//                 amount:
//                     Number(row["amount"]) || 0,
//                 description:
//                     row["description"] || "",
//                 taxProfileResourceId:
//                     row["taxProfileResourceId"]?.toString().trim() || undefined,
//             });
//         }

//         const success = [];
//         const results = [];

//         for (const payload of Object.values(
//             groupedData
//         )) {
//             try {
//                 console.log(
//                     "Payload:",
//                     JSON.stringify(
//                         payload,
//                         null,
//                         2
//                     )
//                 );

//                 const response =
//                     await axios.post(
//                         "https://api.getjaz.com/api/v1/cash-in-entries",
//                         payload,
//                         {
//                             headers: {
//                                 "x-jk-api-key":
//                                     process.env
//                                         .JAZ_API_KEY,
//                                 "Content-Type":
//                                     "application/json"
//                             }
//                         }
//                     );

//                 console.log(
//                     ` Cash In Created: ${payload.reference}`
//                 );

//                 success.push({
//                     reference:
//                         payload.reference,
//                     resourceId:
//                         response.data
//                             ?.resourceId,
//                     data: response.data
//                 });
//             } catch (error) {
//                 console.log(
//                     ` Error for ${payload.reference}`
//                 );

//                 console.log(
//                     error.response?.data ||
//                     error.message
//                 );

//                 results.push({
//                     reference:
//                         payload.reference,
//                     reason:
//                         error.response?.data ||
//                         error.message
//                 });
//             }
//         }

//         return res.status(200).json({
//             success: true,
//             totalRows:
//                 excelData.length,
//             totalReferences:
//                 Object.keys(
//                     groupedData
//                 ).length,
//             successCount:
//                 success.length,
//             resultsCount:
//                 results.length,
//             success,
//             results
//         });
//     } catch (error) {
//         console.error(
//             "Cash In Import Error:",
//             error.message
//         );

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };



// id working code 

const normalize = (value) =>
    String(value || "")
        .trim()              // start/end spaces remove
        .replace(/\s+/g, " ") // multiple spaces -> single space
        .toLowerCase();

const createCashIn = async (req, res) => {
    try {
        // const filePath = path.join(
        //     process.cwd(),
        //     "files",
        //     "rmtestingfile.xlsx"
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

        // Fetch Master Data
        const coaList =
            await getAccount(apiKey);

        console.log("coa", coaList.length)

        const contactList =
            await getCustomer(apiKey);

        const bankList =
            await getBankAccounts(apiKey);


        const taxProfile = await getTaxProfile(apiKey)


        // Create lookup maps
        const accountMap = {};
        const contactMap = {};
        const bankMap = {};


        const taxProfileMap = {};

        taxProfile.forEach(tp => {
            taxProfileMap[
                tp.name?.trim().toLowerCase()
            ] = tp.resourceId;
        });

        coaList.forEach(acc => {
            accountMap[
                acc.name
                    ?.trim()
                    .toLowerCase()
            ] = acc.resourceId;
        });

        contactList.forEach(contact => {
            contactMap[
                contact.name
                    ?.trim()
                    .toLowerCase()
            ] = contact.resourceId;
        });

        bankList.forEach(bank => {
            bankMap[
                bank.name
                    ?.trim()
                    .toLowerCase()
            ] = bank.resourceId;
        });

        const findId = (map, value) => {
            if (!value) return null;

            return (
                map[
                String(value)
                    .trim()
                    .toLowerCase()
                ] || null
            );
        };

        const groupedData = {};

        const results = [];

        for (const row of excelData) {

            console.log("row2222", row)

            const reference = String(
                row["reference*"]
            )

            const bankAccountId =
                findId(
                    bankMap,
                    normalize(row["bank name"])
                );


            if (!bankAccountId) {
                console.log(`Bank Name Not Found: ${row["bank name"]}`)
            }

            const contactId =
                findId(
                    contactMap,
                    normalize(row["contact name"])
                );

            if (!bankAccountId) {
                console.log(`Contact Name Not Found: ${row["contact name"]}`)
            }


            const taxProfileId = findId(
                taxProfileMap,
                normalize(row["taxProfile"])
            );



            if (!taxProfileId && row["taxProfile"]) {
                console.log(`taxProfile Not Found: ${row["taxProfile"]}`);
            }


            if (!groupedData[reference]) {

                groupedData[
                    reference
                ] = {
                    reference,

                    valueDate:
                        excelDateToJSDate(
                            row[
                            "valueDate*"
                            ]
                        ),

                    accountResourceId:
                        bankAccountId,

                    ...(contactId && {
                        contactResourceId:
                            contactId,
                    }),

                    saveAsDraft:
                        String(
                            row[
                            "saveAsDraft"
                            ] || row[
                            "saveAsDraft*"
                            ]
                        )
                            .trim()
                            .toUpperCase() ===
                        "TRUE",

                    taxVatApplicable:
                        String(
                            row[
                            "taxVatApplicable"
                            ] || ""
                        )
                            .trim()
                            .toUpperCase() ===
                        "TRUE",

                    ...(row[
                        "currency"
                    ] && {
                        currency: {
                            sourceCurrency:
                                row[
                                    "currency"
                                ]
                                    .toString()
                                    .trim(),

                            ...(row[
                                "Exchangerate"
                            ] && {
                                exchangeRate:
                                    Number(
                                        row[
                                        "Exchangerate"
                                        ]
                                    ),
                            }),
                        },
                    }),

                    lines: [],
                };
            }

            // const accountId =
            //     findId(
            //         accountMap,
            //         row[
            //         "account name"
            //         ]
            //     );

            // if (!accountId) {
            //     throw new Error(
            //         `Account not found : ${row["account name"]}`
            //     );
            // }

            const accountId = findId(
                accountMap,
                normalize(row["account name"])
            );

            if (!accountId) {
                console.log(`Account Name Not Found: ${row["account name"]}`)
            }

            const line = {
                accountResourceId: accountId,

                amount: Number(row["amount"]) || 0,

                description: row["description"] || "",

                ...(taxProfileId && {
                    taxProfileResourceId: taxProfileId,
                }),
            };


            groupedData[reference].lines.push(line);
        }





        for (const payload of Object.values(
            groupedData
        )) {
            try {

                console.log(
                    "Payload:",
                    JSON.stringify(
                        payload,
                        null,
                        2
                    )
                );

                const response =
                    await axios.post(
                        "https://api.getjaz.com/api/v1/cash-in-entries",
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
                    reference:
                        payload.reference,
                    status: "success",
                    data:
                        response.data,
                });



            } catch (error) {

                results.push({
                    status: "failed",
                    reference:
                        payload.reference,
                    error:
                        error.response
                            ?.data ||
                        error.message,
                });
            }
        }

        return res.status(200).json({
            success: true,
            totalRows:
                excelData.length,
            totalRecords:
                Object.keys(
                    groupedData
                ).length,
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
            error: error.message,
        });
    }
};




const cashIn = { createCashIn }

export default cashIn
