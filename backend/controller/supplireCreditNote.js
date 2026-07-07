import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getAccounts from "./getController/getChartOfAccount.js"
import getContacts from "./getController/getSupplire.js"
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


// wprking code 


// const createSupplireCreditNote = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "supplireCreditNote.xlsx"
//         );

//         const workbook = XLSX.readFile(filePath);
//         const worksheet =
//             workbook.Sheets[workbook.SheetNames[0]];

//         const excelData =
//             XLSX.utils.sheet_to_json(worksheet);

//         const groupedInvoice = {};

//         for (const row of excelData) {
//             console.log("row =>", row);

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

//                     valueDate:
//                         row["date"]
//                             ? excelDateToJSDate(
//                                   row["date"]
//                               )
//                             : undefined,

//                     dueDate:
//                         row["duedate"]
//                             ? excelDateToJSDate(
//                                   row["duedate"]
//                               )
//                             : undefined,

//                     saveAsDraft:
//                         Boolean(
//                             row["savedarft"]
//                         ),

//                     taxInclusive:
//                         Boolean(
//                             row["taxinclusive"]
//                         ),

//                     ...(row["currency"] && {
//                         currency: {
//                             sourceCurrency:
//                                 row[
//                                     "currency"
//                                 ]
//                                     .toString()
//                                     .trim(),

//                             ...(row[
//                                 "exchange"
//                             ] && {
//                                 exchangeRate:
//                                     Number(
//                                         row[
//                                             "exchange"
//                                         ]
//                                     ),
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
//                     undefined &&
//                 row["Line Discount"] !==
//                     ""
//             ) {
//                 lineItem.discount =
//                     Number(
//                         row[
//                             "Line Discount"
//                         ]
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

//                 const response =
//                     await axios.post(
//                         "https://api.getjaz.com/api/v1/supplier-credit-notes",
//                         payload,
//                         {
//                             headers: {
//                                 "x-jk-api-key":
//                                     process
//                                         .env
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
//                     reference:
//                         payload.reference,
//                     data:
//                         response.data,
//                 });
//             } catch (error) {
//                 console.log(
//                     `Error for ${payload.reference}`,
//                     error.response
//                         ?.data ||
//                         error.message
//                 );

//                 results.push({
//                     status: "failed",
//                     reference:
//                         payload.reference,
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
//             totalCreditNotes:
//                 Object.keys(
//                     groupedInvoice
//                 ).length,
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


// id wala code 


const createSupplireCreditNote = async (req, res) => {
    try {
        // const filePath = path.join(
        //     process.cwd(),
        //     "files",
        //     "supplireCreditNote.xlsx"
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
        const accounts = await getAccounts(apiKey);
        const contacts = await getContacts(apiKey);
        const taxes = await getTaxes(apiKey);

        const successRows = [];
        const failedRows = [];
        const results = [];

        const normalize = (str = "") =>
            str.toString().trim().toLowerCase();

        const findId = (list, name) => {
            if (!name) return undefined;

            const item = list.find(
                (x) =>
                    normalize(
                        x.name ||
                        x.displayName ||
                        x.accountName
                    ) === normalize(name)
            );

            return item?.resourceId;
        };

        const groupedInvoice = {};

        for (const row of excelData) {
            console.log("row", row)
            const reference =
                row["reference"]?.toString().trim() ||
                row["reference*"]?.toString().trim();

            if (!reference) continue;

            // Contact Mapping
            const contactResourceId = findId(
                contacts,
                row["contact name"]
            );

            if (!contactResourceId) {
                failedRows.push({
                    reference,
                    status: "failed",
                    reason: "Contact not found",
                    contactName: row["contact name"],
                    row,
                });
                continue;
            }

            if (!groupedInvoice[reference]) {
                groupedInvoice[reference] = {
                    contactResourceId,
                    reference,

                    valueDate: row["date"]
                        ? excelDateToJSDate(row["date"])
                        : undefined,

                    dueDate: row["duedate"]
                        ? excelDateToJSDate(
                            row["duedate"]
                        )
                        : undefined,

                    saveAsDraft: Boolean(
                        row["savedarft"]
                    ),

                    taxInclusive: Boolean(
                        row["taxinclusive"]
                    ),

                    ...(row["currency"] && {
                        currency: {
                            sourceCurrency:
                                row["currency"]
                                    .toString()
                                    .trim(),

                            ...(row["exchange"] && {
                                exchangeRate: Number(
                                    row["exchange"]
                                ),
                            }),
                        },
                    }),

                    lineItems: [],
                };
            }

            // Account Mapping
            const accountResourceId = findId(
                accounts,
                row["account name"]
            );

            if (!accountResourceId) {
                failedRows.push({
                    reference,
                    status: "failed",
                    reason: "Account not found",
                    accountName: row["account name"],
                    row,
                });
                continue;
            }

            const lineItem = {
                name: row["Item name"]
                    ?.toString()
                    .trim(),

                quantity: Number(
                    row["Quantity"] || 1
                ),

                unitPrice: Number(
                    row["unitprice"] || 0
                ),

                accountResourceId,
            };

            // Tax Mapping
            if (
                row["Taxapplicable"] &&
                row["tax name"]
            ) {
                const taxProfileResourceId =
                    findId(
                        taxes,
                        row["tax name"]
                    );

                if (!taxProfileResourceId) {
                    failedRows.push({
                        reference,
                        status: "failed",
                        reason: "Tax not found",
                        taxName: row["tax name"],
                        row,
                    });
                    continue;
                }

                lineItem.taxProfileResourceId =
                    taxProfileResourceId;
            }

            if (
                row["Line Discount"] !==
                undefined &&
                row["Line Discount"] !== ""
            ) {
                lineItem.discount = Number(
                    row["Line Discount"]
                );
            }

            groupedInvoice[
                reference
            ].lineItems.push(lineItem);
        }


        for (const payload of Object.values(
            groupedInvoice
        )) {
            try {
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
                        "https://api.getjaz.com/api/v1/supplier-credit-notes",
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

                successRows.push({
                    reference: payload.reference,
                    status: "success",
                    response: response.data,
                });

                results.push({
                    reference: payload.reference,
                    status: "success",
                    data: response.data,
                });
            } catch (error) {
                failedRows.push({
                    reference: payload.reference,
                    status: "failed",
                    reason: "API Error",
                    error:
                        error.response?.data ||
                        error.message,
                    payload,
                });

                results.push({
                    reference: payload.reference,
                    status: "failed",
                    error:
                        error.response?.data ||
                        error.message,
                });
            }
        }

        return res.status(200).json({
            success: true,

            totalRows: excelData.length,

            totalRecords:
                Object.keys(groupedInvoice).length,

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


const supplireCreditNote = { createSupplireCreditNote }

export default supplireCreditNote
