import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getAccounts from "./getController/getChartOfAccount.js"
import getContacts from "./getController/getCustomer.js"
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


// const createInvoice = async (req, res) => {
//     try {
//         const filePath = path.join(
//             process.cwd(),
//             "files",
//             "invoice.xlsx"
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

//                 const response =
//                     await axios.post(
//                         "https://api.getjaz.com/api/v1/invoices",
//                         payload,
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



const getInvoiceId = async (req, res) => {
    try {
        const response = await axios.get(
            // "https://api.getjaz.com/api/v1/bills",
            'https://api.getjaz.com/api/v1/invoices',
            {
                params: {
                    limit: 1000,
                    view: "full",
                },
                headers: {
                    accept: "application/json",
                    "x-jk-api-key": process.env.JAZ_API_KEY,
                },
            }
        );

        // return res.status(200).json({
        //     success: true,
        //     count: response.data?.data?.length || 0,
        //     data: response.data,
        // });

        const result = response.data.data.map(invoice => ({
            invoiceName: invoice.contact?.billingName || invoice.contact?.name,
            reference: invoice.reference,
            resourceId: invoice.resourceId
        }));

        return res.status(200).json({
            success: true,
            count: response.data?.data?.length || 0,
            data: result,
        });
    } catch (error) {
        console.error(
            "Get Bills Error:",
            error.response?.data || error.message
        );

        return res.status(
            error.response?.status || 500
        ).json({
            success: false,
            error:
                error.response?.data ||
                error.message,
        });
    }
}


// id working code 

const normalize = (value = "") =>
    value
        .toString()
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();


const createInvoice = async (req, res) => {
    try {
        // const filePath = path.join(
        //     process.cwd(),
        //     "files",
        //     "invoice.xlsx"
        // );

        const { apiKey } = req.body

        console.log("apikey", apiKey)

        // const workbook = XLSX.readFile(filePath);
        const workbook = XLSX.read(req.file.buffer, {
            type: "buffer",
        });

        const worksheet =
            workbook.Sheets[workbook.SheetNames[0]];

        const excelData = XLSX.utils.sheet_to_json(
            worksheet
        );

        // Fetch master data
        const accounts = await getAccounts(apiKey);
        const contact = await getContacts(apiKey);
        const taxProfile = await getTaxes(apiKey);

        // console.log("account", accounts.length)
        // console.log("contact", contact.length)
        // console.log("contact", contact)
        // console.log("taxProfile", taxProfile.length)


        // Common function for mapping name -> resourceId
        const findId = (list, key) => {
            const item = list.find((x) => {
                const listName = (x.name || "")
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

        const groupedInvoice = {};

        for (const row of excelData) {

            // console.log("row", row)

            const reference = row["reference"]
                ?.toString()
                .trim() || row["reference*"]
                    ?.toString()
                    .trim();

            if (!reference) continue;

            // Contact Mapping
            const contactResourceId = findId(
                contact,
                row["contact name"]
            );

            // if (!contactResourceId) {
            //     console.log(`Contact not found : ${row["contact name"]}`)
            // }

            if (!groupedInvoice[reference]) {
                groupedInvoice[reference] = {
                    contactResourceId,
                    reference,
                    valueDate: excelDateToJSDate(row["date"]),
                    dueDate: excelDateToJSDate(row["duedate"]),
                    saveAsDraft: Boolean(row["savedarft"]),
                    taxInclusive: Boolean(row["taxinclusive"]),

                    ...(row["currency"] && {
                        currency: {
                            sourceCurrency: row["currency"]
                                ?.toString()
                                .trim(),

                            ...(row["exchangerate"] && {
                                exchangeRate: Number(
                                    row["exchangerate"]
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

            // if (!accountResourceId) {
            //     console.log(`Account not found : ${row["account name"]}`)
            // }

            const lineItem = {
                name: row["Item name"]
                    ?.toString()
                    .trim(),
                quantity: Number(row["Quantity"] || 1),
                unitPrice: Number(row["unitprice"] || 0),
                // unit: Number(row["unit"] || 0),
                accountResourceId,
            };

            // Tax Profile Mapping
            if (row["Taxapplicable"]) {

                const taxProfileResourceId = findId(
                    taxProfile,
                    row["tax name"]
                );

                // if (!taxProfileResourceId) {
                //     console.log(`Tax Profile not found : ${row["tax name"]}`)
                // }

                lineItem.taxProfileResourceId =
                    taxProfileResourceId;
            }

            if (
                row["Line Discount"] !== undefined &&
                row["Line Discount"] !== ""
            ) {
                lineItem.discount = Number(
                    row["Line Discount"]
                );
            }

            groupedInvoice[reference].lineItems.push(
                lineItem
            );
        }

        const results = [];

        for (const payload of Object.values(groupedInvoice)) {
            try {
                // console.log(
                //     "Payload:",
                //     JSON.stringify(payload, null, 2)
                // );

                const response = await axios.post(
                    "https://api.getjaz.com/api/v1/invoices",
                    payload,
                    {
                        headers: {
                            "x-jk-api-key":
                                apiKey,
                            "Content-Type":
                                "application/json",
                            Accept: "application/json",
                        },
                    }
                );

                results.push({
                    status: "success",
                    reference: payload.reference,
                    data: response.data,
                });

            } catch (error) {
                results.push({
                    status: "failed",
                    reference: payload.reference,
                    error:
                        error.response?.data ||
                        error.message,
                });
            }
        }

        console.log("res33", {
            success: true,
            totalRows: excelData.length,
            totalRecords: Object.keys(groupedInvoice)
                .length,
            successCount: results.filter(
                (r) => r.status === "success"
            ).length,
            failedCount: results.filter(
                (r) => r.status === "failed"
            ).length,

            results,
        })

        return res.status(200).json({
            success: true,
            totalRows: excelData.length,
            totalRecords: Object.keys(groupedInvoice)
                .length,
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




const invoice = { createInvoice, getInvoiceId }

export default invoice
