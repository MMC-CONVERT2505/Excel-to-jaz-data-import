import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getAccount from "./getController/getChartOfAccount.js"
import getContact from "./getController/getSupplire.js"
import getBankAccounts from "./getController/getBankAccounts.js"
import getTaxProfiles from "./getController/getTax.js";



// ADD CASH UP or SM spend Money

const excelDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;

    return new Date(utcValue * 1000)
        .toISOString()
        .split("T")[0];
};




// const createCashOut = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "smtestingfile.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData =
//             XLSX.utils.sheet_to_json(worksheet);

//         // Group rows by reference
//         const groupedData = {};

//         for (const row of excelData) {
//             console.log("row", row)
//             // const reference = row["reference*"];

//             const ref = row["reference*"];

//             const reference = ref !== undefined && ref !== null
//                 ? String(ref)
//                 : "";

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

//                     contactResourceId: row["contactResourceId"],

//                     taxVatApplicable:
//                         String(row["taxVatApplicable"] || "")
//                             .trim()
//                             .toUpperCase() === "TRUE",


//                     ...(row["Currency"] && {
//                         currency: {
//                             sourceCurrency:
//                                 row["Currency"]
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
//         const failed = [];

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
//                         "https://api.getjaz.com/api/v1/cash-out-entries",
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
//                     `✅ Cash Out Created: ${payload.reference}`
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
//                     `❌ Error for ${payload.reference}`
//                 );

//                 console.log(
//                     error.response?.data ||
//                     error.message
//                 );

//                 failed.push({
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
//             failedCount:
//                 failed.length,
//             success,
//             failed
//         });
//     } catch (error) {
//         console.error(
//             "Cash Out Import Error:",
//             error.message
//         );

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };



const deleteCashOut = async (req, res) => {
    try {
        const limit = req.query.limit || 1000;
        const offset = req.query.offset || 0;

        // Get Cash-Out Entries
        const response = await axios.get(
            "https://api.getjaz.com/api/v1/cash-out-entries",
            {
                params: {
                    limit,
                    offset,
                },
                headers: {
                    accept: "application/json",
                    "x-jk-api-key": process.env.JAZ_API_KEY,
                },
            }
        );

        const cashOuts = response.data?.data || response.data || [];

        const deleteResults = [];

        for (const item of cashOuts) {
            console.log("item", item)
            const resourceId =
                item.parentEntityResourceId;

            console.log("resourceId", resourceId)

            if (!resourceId) {
                deleteResults.push({
                    reference: item.reference,
                    success: false,
                    message: "Resource ID not found",
                });
                continue;
            }

            try {
                const deleteResponse =
                    await axios.delete(
                        `https://api.getjaz.com/api/v1/cash-entries/${resourceId}`,
                        {
                            headers: {
                                accept: "application/json",
                                "x-jk-api-key":
                                    process.env.JAZ_API_KEY,
                            },
                        }
                    );

                deleteResults.push({
                    resource_id: resourceId,
                    reference: item.reference,
                    success: true,
                    response: deleteResponse.data,
                });
            } catch (err) {
                deleteResults.push({
                    resource_id: resourceId,
                    reference: item.reference,
                    success: false,
                    error:
                        err.response?.data ||
                        err.message,
                });
            }
        }

        return res.status(200).json({
            success: true,
            totalRecords: cashOuts.length,
            deleted: deleteResults.filter(
                (x) => x.success
            ).length,
            failed: deleteResults.filter(
                (x) => !x.success
            ).length,
            results: deleteResults,
        });
    } catch (error) {
        console.error(
            "Error deleting Cash-Out entries:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,
            message: "Failed to delete Cash-Out entries",
            error:
                error.response?.data || error.message,
        });
    }
};



// id working code 

const normalize = (str) =>
    String(str || "")
        .trim()
        .toLowerCase();


const createCashOut = async (req, res) => {
    try {
        // const filePath = path.join(
        //     process.cwd(),
        //     "files",
        //     "smtestingfile.xlsx"
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

        const accounts =
            await getAccount(apiKey);

        console.log("accounts", accounts.length)

        const contacts =
            await getContact(apiKey);

        const bankAccounts =
            await getBankAccounts(apiKey);

        const taxProfile = await getTaxProfiles(apiKey)

        // console.log("bank account", bankAccounts)

        const normalize = (value) =>
            String(value || "")
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "");

        const taxProfileMap = {};

        taxProfile.forEach(tp => {
            taxProfileMap[
                normalize(tp.name)
            ] = tp.resourceId;
        });

        const groupedData = {};

        for (const row of excelData) {
            console.log("row", row)
            const reference = String(
                row["reference*"] || ""
            );

            const bankAccountName =
                row["bank name"];

            const contactName =
                row["contact name"];

            const accountName =
                row["account name"];

            const bankAccountId =
                bankAccounts.find(
                    (x) =>
                        normalize(
                            x.name ||
                            x.accountName ||
                            x.displayName
                        ) ===
                        normalize(
                            bankAccountName
                        )
                )?.resourceId;

            const contactId =
                contacts.find(
                    (x) =>
                        normalize(
                            x.name ||
                            x.accountName ||
                            x.displayName
                        ) ===
                        normalize(
                            contactName
                        )
                )?.resourceId;

            const accountId =
                accounts.find(
                    (x) =>
                        normalize(
                            x.name ||
                            x.accountName ||
                            x.displayName
                        ) ===
                        normalize(
                            accountName
                        )
                )?.resourceId;

            const taxProfileId = taxProfileMap[
                normalize(row["tax profile"])
            ];

            if (!taxProfileId && row["tax profile"]) {
                console.log(`Tax Profile not found: ${row["tax profile"]}`);
            }

            if (!bankAccountId) {
                console.log(`Bank Account not found : ${bankAccountName}`)
            }

            if (!contactId) {
                console.log(`Contact not found : ${contactName}`)
            }

            if (!accountId) {
                console.log(`Account not found : ${accountName}`)
            }

            if (!groupedData[reference]) {
                groupedData[
                    reference
                ] = {
                    reference,

                    valueDate:
                        excelDateToJSDate(
                            row["valueDate*"]
                        ),

                    accountResourceId:
                        bankAccountId,

                    contactResourceId:
                        contactId,

                    saveAsDraft:
                        String(
                            row[
                            "saveAsDraft*"
                            ] || ""
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
                        "Currency"
                    ] && {
                        currency: {
                            sourceCurrency:
                                row[
                                    "Currency"
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

            groupedData[
                reference
            ].lines.push({
                accountResourceId:
                    accountId,

                amount:
                    Number(
                        row["amount"]
                    ) || 0,

                description:
                    row[
                    "description"
                    ] || "",

                taxProfileResourceId: taxProfileId,
            });
        }

        const results = [];

        for (const payload of Object.values(
            groupedData
        )) {
            console.log("payload", payload)
            try {
                const response =
                    await axios.post(
                        "https://api.getjaz.com/api/v1/cash-out-entries",
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
                    data: response.data,
                });
            } catch (error) {
                results.push({
                    reference:
                        payload.reference,
                    status: "failed",
                    error:
                        error.response
                            ?.data ||
                        error.message,
                });
            }
        }

        return res.status(200).json({
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
            message:
                error.message,
        });
    }
};





const cashOut = { createCashOut, deleteCashOut }

export default cashOut
