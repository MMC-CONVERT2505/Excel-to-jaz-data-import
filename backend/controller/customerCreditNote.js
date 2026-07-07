import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getAccounts from "./getController/getChartOfAccount.js"
import getContact from "./getController/getCustomer.js"
import getTaxes from "./getController/getTax.js"

// ADD Tag

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

// const createCustomerCreditNote = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "customerCreditNote.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData = XLSX.utils.sheet_to_json(
//             worksheet
//         );

//         const groupedInvoice = {};

//         for (const row of excelData) {
//             console.log("row", row)
//             const reference = row["reference"]
//                 ?.toString()
//                 .trim();

//             if (!reference) continue;

//             if (!groupedInvoice[reference]) {
//                 groupedInvoice[reference] = {
//                     contactResourceId:
//                         row["contactID"]
//                             ?.toString()
//                             .trim(),

//                     reference,

//                     valueDate: excelDateToJSDate(
//                         row["date"]
//                     ),

//                     dueDate: excelDateToJSDate(
//                         row["duedate"]
//                     ),

//                     saveAsDraft:
//                         Boolean(row["savedarft"]),

//                     taxInclusive:
//                         Boolean(row["taxinclusive"]),

//                     ...(row["currency"] && {
//                         currency: {
//                             sourceCurrency:
//                                 row["currency"]
//                                     ?.toString()
//                                     .trim(),

//                             ...(row["exchangerate"] && {
//                                 exchangeRate: Number(
//                                     row["exchangerate"]
//                                 ),
//                             }),
//                         },
//                     }),

//                     lineItems: [],
//                 };
//             }

//             const lineItem = {
//                 name: row["Item name"]
//                     ?.toString()
//                     .trim(),

//                 quantity: Number(
//                     row["Quantity"] || 1
//                 ),

//                 unitPrice: Number(
//                     row["unitprice"] || 0
//                 ),

//                 accountResourceId:
//                     row["Accountid"]
//                         ?.toString()
//                         .trim(),
//             };

//             if (
//                 row["Taxapplicable"] &&
//                 row["taxid"]
//             ) {
//                 lineItem.taxProfileResourceId =
//                     row["taxid"]
//                         ?.toString()
//                         .trim();
//             }

//             if (
//                 row["Line Discount"] !==
//                 undefined &&
//                 row["Line Discount"] !== ""
//             ) {
//                 lineItem.discount =
//                     Number(
//                         row["Line Discount"]
//                     );
//             }

//             groupedInvoice[
//                 reference
//             ].lineItems.push(lineItem);
//         }

//         const results = [];

//         for (const payload of Object.values(
//             groupedInvoice
//         )) {
//             try {
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
//                 //         "https://api.getjaz.com/api/v1/invoices",
//                 //         payload,
//                 //         {
//                 //             headers: {
//                 //                 "x-jk-api-key":
//                 //                     process.env
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
//                     reference:
//                         payload.reference,
//                     data: response.data,
//                 });
//             } catch (error) {
//                 console.log(
//                     `Error for ${payload.reference}`,
//                     error.response?.data ||
//                     error.message
//                 );

//                 results.push({
//                     status: "failed",
//                     reference:
//                         payload.reference,
//                     error:
//                         error.response?.data ||
//                         error.message,
//                 });
//             }
//         }

//         return res.status(200).json({
//             success: true,
//             totalRows:
//                 excelData.length,
//             totalInvoices:
//                 Object.keys(
//                     groupedInvoice
//                 ).length,
//             results,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };


// working code 

// const createCustomerCreditNote = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "customerCreditNote.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData =
//             XLSX.utils.sheet_to_json(worksheet);

//         const groupedCreditNotes = {};

//         for (const row of excelData) {
//             const reference = row["reference"]
//                 ?.toString()
//                 .trim();

//             if (!reference) continue;

//             if (!groupedCreditNotes[reference]) {
//                 groupedCreditNotes[reference] = {
//                     ...(row["capsuleResourceId"] && {
//                         capsuleResourceId:
//                             row["capsuleResourceId"]
//                                 .toString()
//                                 .trim(),
//                     }),

//                     contactResourceId:
//                         row["contactID"]
//                             ?.toString()
//                             .trim(),

//                     reference,

//                     valueDate: excelDateToJSDate(
//                         row["date"]
//                     ),

//                     ...(row["duedate"] && {
//                         dueDate: excelDateToJSDate(
//                             row["duedate"]
//                         ),
//                     }),

//                     saveAsDraft:
//                         String(row["savedraft"])
//                             .toLowerCase() === "true",

//                     submitForApproval:
//                         String(row["submitForApproval"])
//                             .toLowerCase() === "true",

//                     ...(row["notes"] && {
//                         notes: row["notes"]
//                             .toString()
//                             .trim(),
//                     }),

//                     ...(row["internalNotes"] && {
//                         internalNotes:
//                             row["internalNotes"]
//                                 .toString()
//                                 .trim(),
//                     }),

//                     ...(row["currency"] && {
//                         currency: {
//                             sourceCurrency:
//                                 row["currency"]
//                                     .toString()
//                                     .trim(),

//                             ...(row["exchangerate"] && {
//                                 exchangeRate: Number(
//                                     row["exchangerate"]
//                                 ),
//                             }),
//                         },
//                     }),

//                     ...(row["taxcurrency"] && {
//                         taxCurrency: {
//                             sourceCurrency:
//                                 row["taxcurrency"]
//                                     .toString()
//                                     .trim(),
//                         },
//                     }),

//                     // ...(row["Taxapplicable"] !==
//                     //     undefined && {
//                     //     isTaxVATApplicable:
//                     //         String(
//                     //             row["Taxapplicable"]
//                     //         ).toLowerCase() === "true",
//                     // }),

//                     ...(row["Taxapplicable"] !== undefined &&
//                         String(row["Taxapplicable"]).toLowerCase() === "true" && {
//                         isTaxVATApplicable: true,
//                     }),

//                     ...(row["taxinclusive"] !==
//                         undefined && {
//                         taxInclusion:
//                             String(
//                                 row["taxinclusive"]
//                             ).toLowerCase() === "true",
//                     }),

//                     ...(row["tags"] && {
//                         tags: row["tags"]
//                             .toString()
//                             .split(",")
//                             .map((t) => t.trim()),
//                     }),

//                     lineItems: [],
//                 };
//             }

//             const lineItem = {
//                 name: row["Item name"]
//                     ?.toString()
//                     .trim(),

//                 quantity: Number(
//                     row["Quantity"] || 1
//                 ),

//                 unitPrice: Number(
//                     row["unitprice"] || 0
//                 ),

//                 ...(row["Accountid"] && {
//                     accountResourceId:
//                         row["Accountid"]
//                             .toString()
//                             .trim(),
//                 }),
//             };

//             if (row["taxid"]) {
//                 lineItem.taxProfileResourceId =
//                     row["taxid"]
//                         .toString()
//                         .trim();
//             }

//             if (
//                 row["Line Discount"] !==
//                 undefined &&
//                 row["Line Discount"] !== ""
//             ) {
//                 lineItem.discountPercentage =
//                     Number(
//                         row["Line Discount"]
//                     );
//             }

//             groupedCreditNotes[
//                 reference
//             ].lineItems.push(lineItem);
//         }

//         const results = [];

//         for (const payload of Object.values(
//             groupedCreditNotes
//         )) {
//             try {
//                 console.log(
//                     "Payload =>",
//                     JSON.stringify(
//                         payload,
//                         null,
//                         2
//                     )
//                 );

//                 const response =
//                     await axios.post(
//                         "https://api.getjaz.com/api/v1/customer-credit-notes",
//                         payload,
//                         {
//                             headers: {
//                                 "x-jk-api-key":
//                                     process.env.JAZ_API_KEY,
//                                 "Content-Type":
//                                     "application/json",
//                                 Accept:
//                                     "application/json",
//                             },
//                         }
//                     );

//                 results.push({
//                     status: "success",
//                     reference:
//                         payload.reference,
//                     data: response.data,
//                 });
//             } catch (error) {
//                 console.log(
//                     `Error for ${payload.reference}`,
//                     error.response?.data ||
//                     error.message
//                 );

//                 results.push({
//                     status: "failed",
//                     reference:
//                         payload.reference,
//                     error:
//                         error.response?.data ||
//                         error.message,
//                 });
//             }
//         }

//         return res.status(200).json({
//             success: true,
//             totalRows:
//                 excelData.length,
//             totalCreditNotes:
//                 Object.keys(
//                     groupedCreditNotes
//                 ).length,
//             results,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }; 



// id wala code 




const createCustomerCreditNote = async (req, res) => {
    try {
        // const filePath = path.join(
        //     process.cwd(),
        //     "files",
        //     "customerCreditNote.xlsx"
        // );


        const { apiKey } = req.body

        console.log("apikey", apiKey)

        // const workbook = XLSX.readFile(filePath);
        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer",
        });


        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = XLSX.utils.sheet_to_json(worksheet);

        // Master Data
        const accounts = await getAccounts(apiKey);
        const contacts = await getContact(apiKey);
        const taxes = await getTaxes(apiKey);


        const normalize = (value = "") =>
            value.toString().trim().toLowerCase();

        const groupedCreditNotes = {};

        for (const row of excelData) {

            console.log("row", row)

            const reference = row["reference"]?.toString().trim() || row["reference*"]?.toString().trim();

            if (!reference) continue;

            // Contact Mapping
            const contact = contacts.find(
                (c) =>
                    normalize(
                        c.displayName ||
                        c.name ||
                        c.contactName
                    ) === normalize(row["contact name"])
            );

            if (!groupedCreditNotes[reference]) {

                groupedCreditNotes[reference] = {
                    contactResourceId:
                        contact?.resourceId,

                    reference,

                    valueDate: excelDateToJSDate(
                        row["date"]
                    ),


                    ...(row["duedate"] && {
                        dueDate: excelDateToJSDate(
                            row["duedate"]
                        ),
                    }),

                    ...(String(row["savedraft"]).toLowerCase() === "true" && {
                        saveAsDraft: true,
                    }),



                    ...(row["currency"] && {
                        currency: {
                            sourceCurrency:
                                row["currency"]
                                    .toString()
                                    .trim(),

                            ...(row["exchangerate"] && {
                                exchangeRate: Number(
                                    row["exchangerate"]
                                ),
                            }),
                        },
                    }),

                    ...(row["taxcurrency"] && {
                        taxCurrency: {
                            sourceCurrency:
                                row["taxcurrency"]
                                    .toString()
                                    .trim(),
                        },
                    }),


                    ...(row["Taxapplicable"] !== undefined &&
                        String(row["Taxapplicable"]).toLowerCase() === "true" && {
                        isTaxVATApplicable: true,
                    }),

                    ...(row["taxinclusive"] !==
                        undefined && {
                        taxInclusion:
                            String(
                                row["taxinclusive"]
                            ).toLowerCase() === "true",
                    }),

                    lineItems: [],
                };
            }

            // Account Mapping
            const account = accounts.find(
                (a) =>
                    normalize(
                        a.name ||
                        a.accountName
                    ) === normalize(
                        row["account name"]
                    )
            );

            // Tax Mapping
            const tax = taxes.find(
                (t) =>
                    normalize(
                        t.name ||
                        t.taxName
                    ) === normalize(
                        row["tax name"]
                    )
            );

            groupedCreditNotes[
                reference
            ].lineItems.push({
                name: row["Item name"]?.toString().trim(),
                quantity: Number(row["Quantity"] || 1),
                unitPrice: Number(row["unitprice"] || 0),

                accountResourceId:
                    account?.resourceId,

                taxProfileResourceId:
                    tax?.resourceId,
            });
        }

        const results = [];

        for (const payload of Object.values(groupedCreditNotes)) {

            // Validation
            if (!payload.contactResourceId) {
                results.push({
                    reference: payload.reference,
                    error: "Contact not found",
                });
                continue;
            }

            console.log("payload", payload)

            const invalidAccount = payload.lineItems.find(
                (x) => !x.accountResourceId
            );


            if (invalidAccount) {
                results.push({
                    reference: payload.reference,
                    error: `Account not found (${invalidAccount.name})`,
                });
                continue;
            }

            try {

                const response = await axios.post(
                    "https://api.getjaz.com/api/v1/customer-credit-notes",
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
                    reference: payload.reference,
                    data: response.data,
                });

            } catch (error) {

                results.push({
                    status:
                        "failed",
                    reference: payload.reference,
                    error:
                        error.response?.data ||
                        error.message,
                });

            }
        }

        return res.status(200).json({
            success: true,
            totalRows: excelData.length,
            totalRecords: Object.keys(groupedCreditNotes).length,

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


const customerCreditNote = { createCustomerCreditNote }

export default customerCreditNote
