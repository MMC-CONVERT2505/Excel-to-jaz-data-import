import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getInvoice from "./getController/getInvoice.js"
import getAccounts from "./getController/getChartOfAccount.js"

// ADD 

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



// const createInvoicePayment = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "invoicePayment.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData =
//             XLSX.utils.sheet_to_json(worksheet);

//         // Group by Invoice Resource Id
//         const groupedInvoices = {};

//         for (const row of excelData) {
//             console.log("Row =>", row);

//             const invoiceResourceId =
//                 row["invid*"]
//                     ?.toString()
//                     .trim();

//             if (!invoiceResourceId) continue;

//             // Create invoice group if not exists
//             if (
//                 !groupedInvoices[
//                 invoiceResourceId
//                 ]
//             ) {
//                 groupedInvoices[
//                     invoiceResourceId
//                 ] = {
//                     resourceId:
//                         invoiceResourceId,
//                     payments: [],
//                 };
//             }

//             // Payment object
//             const payment = {
//                 paymentMethod:
//                     row["paymethod*"]
//                         ?.toString()
//                         .trim(),

//                 saveAsDraft:
//                     row["saveas draft*"] ===
//                     true ||
//                     row["saveas draft*"] ===
//                     "true",
//             };

//             // Optional Fields

//             if (row["reference*"]) {
//                 payment.reference =
//                     row["reference*"]
//                         .toString()
//                         .trim();
//             }

//             if (row["valuedate*"]) {
//                 payment.valueDate =
//                     excelDateToJSDate(
//                         row["valuedate*"]
//                     );
//             }

//             if (
//                 row["accountResourceId*"]
//             ) {
//                 payment.account = {
//                     resourceId:
//                         row[
//                             "accountResourceId*"
//                         ]
//                             .toString()
//                             .trim(),
//                 };
//             }

//             if (row["paymentAmount*"]) {
//                 payment.paymentAmount =
//                     Number(
//                         row["paymentAmount*"]
//                     );
//             }

//             if (
//                 row["transactionAmount*"]
//             ) {
//                 payment.transactionAmount =
//                     Number(
//                         row[
//                         "transactionAmount*"
//                         ]
//                     );
//             }

//             // Currency (Optional)
//             if (row["currency"]) {
//                 payment.currency = {
//                     sourceCurrency:
//                         row["currency"]
//                             .toString()
//                             .trim(),
//                 };

//                 if (row["exchange"]) {
//                     payment.currency.exchangeRate =
//                         Number(
//                             row["exchange"]
//                         );
//                 }
//             }

//             // Add payment into payments array
//             groupedInvoices[
//                 invoiceResourceId
//             ].payments.push(payment);
//         }

//         const invoicePayments =
//             Object.values(groupedInvoices);

//         console.log(
//             "Grouped Payload =>",
//             JSON.stringify(
//                 invoicePayments,
//                 null,
//                 2
//             )
//         );

//         const results = [];

//         for (const payload of invoicePayments) {
//             try {
//                 console.log(
//                     "Sending Payload =>",
//                     JSON.stringify(
//                         {
//                             payments:
//                                 payload.payments,
//                         },
//                         null,
//                         2
//                     )
//                 );

//                 // const response =
//                 //     await axios.post(
//                 //         `https://api.getjaz.com/api/v1/invoices/${payload.resourceId}/payments`,
//                 //         {
//                 //             payments:
//                 //                 payload.payments,
//                 //         },
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
//                     invoiceResourceId:
//                         payload.resourceId,
//                     response:
//                         response.data,
//                 });
//             } catch (error) {
//                 console.log(
//                     `Error for Invoice ${payload.resourceId}:`,
//                     error.response?.data ||
//                     error.message
//                 );

//                 results.push({
//                     status: "failed",
//                     invoiceResourceId:
//                         payload.resourceId,
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
//                 invoicePayments.length,
//             results,
//         });
//     } catch (error) {
//         console.log(
//             "Main Error =>",
//             error.message
//         );

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };


// working 

// const createInvoicePayment = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "invoicePayment.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData =
//             XLSX.utils.sheet_to_json(worksheet);

//         // Group by Invoice Resource Id + Reference
//         const groupedInvoices = {};

//         for (const row of excelData) {
//             console.log("Row =>", row);

//             const invoiceResourceId =
//                 row["invid*"]?.toString().trim();

//             const reference =
//                 row["reference*"]?.toString().trim() || "";

//             if (!invoiceResourceId) continue;

//             // Same invoice + same reference = one payload
//             const groupKey = `${invoiceResourceId}_${reference}`;

//             // Create group if not exists
//             if (!groupedInvoices[groupKey]) {
//                 groupedInvoices[groupKey] = {
//                     resourceId: invoiceResourceId,
//                     payments: [],
//                 };
//             }

//             // Payment object
//             const payment = {
//                 paymentMethod:
//                     row["paymethod*"]
//                         ?.toString()
//                         .trim(),

//                 saveAsDraft:
//                     row["saveas draft*"] === true ||
//                     row["saveas draft*"] === "true",
//             };

//             // Reference
//             if (reference) {
//                 payment.reference = reference;
//             }

//             // Value Date
//             if (row["valuedate*"]) {
//                 payment.valueDate =
//                     excelDateToJSDate(
//                         row["valuedate*"]
//                     );
//             }

//             // Account Resource Id
//             if (row["accountResourceId*"]) {
//                 payment.accountResourceId =
//                     row["accountResourceId*"]
//                         .toString()
//                         .trim();
//             }

//             // Payment Amount
//             if (row["paymentAmount*"]) {
//                 payment.paymentAmount = Number(
//                     row["paymentAmount*"]
//                 );
//             }

//             // Transaction Amount
//             if (row["transactionAmount*"]) {
//                 payment.transactionAmount = Number(
//                     row["transactionAmount*"]
//                 );
//             }

//             // Currency
//             if (row["currency"]) {
//                 payment.currency = {
//                     sourceCurrency:
//                         row["currency"]
//                             .toString()
//                             .trim(),
//                 };

//                 if (row["exchange"]) {
//                     payment.currency.exchangeRate =
//                         Number(row["exchange"]);
//                 }
//             }

//             // Add payment into payments array
//             groupedInvoices[groupKey]
//                 .payments
//                 .push(payment);
//         }

//         const invoicePayments =
//             Object.values(groupedInvoices);

//         console.log(
//             "Grouped Payload =>",
//             JSON.stringify(
//                 invoicePayments,
//                 null,
//                 2
//             )
//         );

//         const results = [];

//         for (const payload of invoicePayments) {
//             try {
//                 console.log(
//                     "Sending Payload =>",
//                     JSON.stringify(
//                         {
//                             payments:
//                                 payload.payments,
//                         },
//                         null,
//                         2
//                     )
//                 );

//                 const response =
//                     await axios.post(
//                         `https://api.getjaz.com/api/v1/invoices/${payload.resourceId}/payments`,
//                         {
//                             payments:
//                                 payload.payments,
//                         },
//                         {
//                             headers: {
//                                 "x-jk-api-key":
//                                     process.env
//                                         .JAZ_API_KEY,
//                                 "Content-Type":
//                                     "application/json",
//                                 Accept:
//                                     "application/json",
//                             },
//                         }
//                     );

//                 results.push({
//                     status: "success",
//                     invoiceResourceId:
//                         payload.resourceId,
//                     response:
//                         response.data,
//                 });
//             } catch (error) {
//                 console.log(
//                     `Error for Invoice ${payload.resourceId}:`,
//                     error.response?.data ||
//                     error.message
//                 );

//                 results.push({
//                     status: "failed",
//                     invoiceResourceId:
//                         payload.resourceId,
//                     error:
//                         error.response?.data ||
//                         error.message,
//                 });
//             }
//         }

//         return res.status(200).json({
//             success: true,
//             totalRows: excelData.length,
//             totalPayloads:
//                 invoicePayments.length,
//             results,
//         });
//     } catch (error) {
//         console.log(
//             "Main Error =>",
//             error.message
//         );

//         return res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// }; 



// id working code  



const createInvoicePayment = async (req, res) => {
    // try {
    // const filePath = path.join(
    //     process.cwd(),
    //     "files",
    //     "invoicePayment.xlsx"
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

    // Fetch master data
    const invoices = await getInvoice(apiKey);
    const accounts = await getAccounts(apiKey);

    // console.log("invoices", invoices)

    const findId = (list, key) => {
        const item = list.find((x) => {
            const listName = (
                x.name ||
                x.reference ||
                ""
            )
                .toString()
                .trim()
                .replace(/\s+/g, " ")
                .toLowerCase();

            const searchName = (key || "")
                .toString()
                .trim()
                .replace(/\s+/g, " ")
                .toLowerCase();

            return listName === searchName;
        });

        return item?.resourceId;
    };

    // const groupedInvoices = {};

    // for (const row of excelData) {
    //     console.log("row", row)

    //     const invoiceName =
    //         row["invoice"] || row["invoice*"];

    //     const invoiceResourceId = findId(
    //         invoices,
    //         invoiceName
    //     );


    //     if (!invoiceResourceId) {
    //         console.log(
    //             `Invoice not found : ${invoiceName}`
    //         );
    //         continue;
    //     }

    //     const accountResourceId = findId(
    //         accounts,
    //         row["account name"]
    //     );

    //     if (!accountResourceId) {
    //         console.log(
    //             `Account not found : ${row["account name"]}`
    //         );
    //         continue;
    //     }

    //     const reference =
    //         row["reference"]
    //             ?.toString()
    //             .trim() ||
    //         row["reference*"]
    //             ?.toString()
    //             .trim();

    //     const groupKey = `${invoiceResourceId}_${reference}`;

    //     if (!groupedInvoices[groupKey]) {
    //         groupedInvoices[groupKey] = {
    //             resourceId: invoiceResourceId,
    //             payments: [],
    //         };
    //     }

    //     const payment = {
    //         paymentMethod: row["paymethod*"]
    //             ?.toString()
    //             .trim(),

    //         accountResourceId,

    //         saveAsDraft:
    //             row["saveas draft*"] === true ||
    //             row["saveas draft*"] === "true",
    //     };

    //     if (reference) {
    //         payment.reference = reference;
    //     }

    //     if (row["valuedate*"]) {
    //         payment.valueDate = excelDateToJSDate(
    //             row["valuedate*"]
    //         );
    //     }

    //     if (row["paymentAmount*"] !== undefined) {
    //         payment.paymentAmount = Number(
    //             row["paymentAmount*"]
    //         );
    //     }

    //     if (row["transactionAmount*"] !== undefined) {
    //         payment.transactionAmount = Number(
    //             row["transactionAmount*"]
    //         );
    //     }

    //     if (row["currency"]) {
    //         payment.currency = {
    //             sourceCurrency: row["currency"]
    //                 .toString()
    //                 .trim(),
    //         };

    //         if (row["exchange"]) {
    //             payment.currency.exchangeRate =
    //                 Number(row["exchange"]);
    //         }
    //     }

    //     groupedInvoices[groupKey].payments.push(
    //         payment
    //     );
    // }

    // const invoicePayments =
    //     Object.values(groupedInvoices);

    // const results = [];

    // for (const payload of invoicePayments) {
    //     try {
    //         console.log("payload", payload)
    //         // const response = await axios.post(
    //         //     `https://api.getjaz.com/api/v1/invoices/${payload.resourceId}/payments`,
    //         //     {
    //         //         payments: payload.payments,
    //         //     },
    //         //     {
    //         //         headers: {
    //         //             "x-jk-api-key":
    //         //                 apiKey,
    //         //             "Content-Type":
    //         //                 "application/json",
    //         //             Accept:
    //         //                 "application/json",
    //         //         },
    //         //     }
    //         // );


    //         results.push({
    //             status: "success",
    //             reference:
    //                 payload.reference,
    //             response: response.data,
    //         });
    //     } catch (error) {

    //         console.log("reference", payload)

    //         results.push({
    //             status: "failed",
    //             reference:
    //                 payload.reference,
    //             error:
    //                 error.response?.data ||
    //                 error.message,
    //         });
    //     }
    // }


    const results = [];

    for (const row of excelData) {
        try {
            const invoiceName = row["invoice"] || row["invoice*"];

            const invoiceResourceId = findId(invoices, invoiceName);

            if (!invoiceResourceId) {
                results.push({
                    status: "failed",
                    reference: row["reference"] || row["reference*"],
                    error: `Invoice not found: ${invoiceName}`,
                });
                continue;
            }

            const accountResourceId = findId(
                accounts,
                row["account name"]
            );

            if (!accountResourceId) {
                results.push({
                    status: "failed",
                    reference: row["reference"] || row["reference*"],
                    error: `Account not found: ${row["account name"]}`,
                });
                continue;
            }

            const payment = {
                paymentMethod: row["paymethod*"]?.toString().trim(),
                accountResourceId,
                saveAsDraft:
                    row["saveas draft*"] === true ||
                    row["saveas draft*"] === "true",
            };

            const reference =
                row["reference"]?.toString().trim() ||
                row["reference*"]?.toString().trim();

            if (reference) {
                payment.reference = reference;
            }

            if (row["valuedate*"]) {
                payment.valueDate = excelDateToJSDate(
                    row["valuedate*"]
                );
            }

            if (row["paymentAmount*"] !== undefined) {
                payment.paymentAmount = Number(
                    row["paymentAmount*"]
                );
            }

            if (row["transactionAmount*"] !== undefined) {
                payment.transactionAmount = Number(
                    row["transactionAmount*"]
                );
            }

            if (row["currency"]) {
                payment.currency = {
                    sourceCurrency: row["currency"].toString().trim(),
                };

                if (row["exchange"]) {
                    payment.currency.exchangeRate = Number(
                        row["exchange"]
                    );
                }
            }

            const payload = {
                payments: [payment],
            };

            // console.log("invoiceRsorceid", invoiceResourceId)

            // console.log("payload", payload);

            const response = await axios.post(
                `https://api.getjaz.com/api/v1/invoices/${invoiceResourceId}/payments`,
                payload,
                {
                    headers: {
                        "x-jk-api-key": apiKey,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

            results.push({
                status: "success",
                reference,
                response: response.data,
            });
        } catch (error) {
            results.push({
                status: "failed",
                reference:
                    row["reference"] || row["reference*"],
                error:
                    error.response?.data || error.message,
            });
        }
    }


    return res.status(200).json({
        totalRows: excelData.length,
        totalRecords:
            results.length,
        successCount: results.filter(
            (r) => r.status === "success"
        ).length,
        failedCount: results.filter(
            (r) => r.status === "failed"
        ).length,

        results,
    });
    // } catch (error) {
    //     return res.status(500).json({
    //         success: false,
    //         error: error.message,
    //     });
    // }
};





const invoicePayment = { createInvoicePayment }

export default invoicePayment