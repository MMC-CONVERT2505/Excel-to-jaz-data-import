import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getSupplier from "./getController/getSupplire.js"
import getCoa from "./getController/getChartOfAccount.js"
import getTax from "./getController/getTax.js"

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



const getBillsId = async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.getjaz.com/api/v1/bills",
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

        const bills = response.data.data;

        const billData = bills.map((bill) => ({
            billName: bill.contact?.name,
            resourceId: bill.resourceId,
            reference: bill.reference
        }));

        return res.status(200).json({
            success: true,
            count: response.data?.data?.length || 0,
            data: billData,
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



// id full working 


const createBill = async (req, res) => {
    try {
    

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

        const coa = await getCoa(apiKey);
        const suppliers =
            await getSupplier(apiKey);
        const taxes =
            await getTax(apiKey);



        // console.log("taxes", taxes)

        const groupedBills = {};
        const results = [];

        for (const row of excelData) {
            console.log("row", row)
            const reference =
                row["reference"]
                    ?.toString()
                    .trim();

            if (!reference) continue;

            const coaAccount =
                coa.find(
                    (c) =>
                        c.name
                            ?.toString()
                            .trim()
                            .toLowerCase() ===
                        row["account name"]
                            ?.toString()
                            .trim()
                            .toLowerCase()
                );

            const supplier =
                suppliers.find(
                    (s) =>
                        s.name
                            ?.toString()
                            .trim()
                            .toLowerCase() ===
                        row[
                            "contact name"
                        ]
                            ?.toString()
                            .trim()
                            .toLowerCase()
                );

            const tax =
                taxes.find(
                    (t) =>
                        t.name
                            ?.toString()
                            .trim()
                            .toLowerCase() ===
                        row["tax name"]
                            ?.toString()
                            .trim()
                            .toLowerCase()
                );

              if(!coaAccount){
                results.push({
                      status:
                        "failed",
                    reference:
                        row["reference"],
                    error: `COA not found: ${row["account name"]}`               
                })
                continue
            } 

             if(!supplier){
                results.push({
                      status:
                        "failed",
                    reference:
                        row["reference"],
                    error: `Supplier not found: ${row["contact name"]}`
                            
                })
                continue
            }


            if (!groupedBills[reference]) {
                groupedBills[
                    reference
                ] = {
                    contactResourceId:
                        supplier.resourceId,

                    reference,

                    valueDate:
                        excelDateToJSDate(
                            row["date"]
                        ),

                    dueDate:
                        excelDateToJSDate(
                            row["duedate"]
                        ),

                    saveAsDraft:
                        row["savedarft"] ===
                        true,

                    taxInclusive: Boolean(row["taxinclusive"]),

                    ...(row["currency"] && {
                        currency: {
                            sourceCurrency:
                                row["currency"]
                                    .toString()
                                    .trim(),

                            ...(row[
                                "exchange"
                            ] && {
                                exchangeRate:
                                    Number(
                                        row[
                                        "exchange"
                                        ]
                                    ),
                            }),
                        },
                    }),

                    lineItems: [],
                };
            }

            groupedBills[
                reference
            ].lineItems.push({
                name: row["Item name"]
                    ?.toString()
                    .trim(),

                quantity: Number(
                    row["Quantity"] ||
                    1
                ),

                unitPrice: Number(
                    row["unitprice"] ||
                    0
                ),

                accountResourceId:
                    coaAccount.resourceId,

                ...(tax && {
                    taxProfileResourceId:
                        tax.resourceId,
                }),
            });
        }

        // const results = [];

        for (const payload of Object.values(
            groupedBills
        )) {
            try {
                console.log(
                    JSON.stringify(
                        payload,
                        null,
                        2
                    )
                );

                const response =
                    await axios.post(
                        "https://api.getjaz.com/api/v1/bills",
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

                console.log("rseponse", response)

                results.push({
                    status:
                        "success",
                    reference:
                        payload.reference,
                    billId:
                        response.data
                            ?.resourceId,
                    data:
                        response.data,
                });
            } catch (error) {
                results.push({
                    status:
                        "failed",
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
                    groupedBills
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
        console.error(error);

        return res.status(500).json({
            success: false,
            message:
                error.message,
        });
    }
};





const bill = { createBill, getBillsId }

export default bill
