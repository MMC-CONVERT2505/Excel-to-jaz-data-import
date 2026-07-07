import axios from "axios";
import XLSX from "xlsx";
import path from "path";

import getAccounts from "./getController/getChartOfAccount.js"

// ADD Item

const createItem = async (req, res) => {
    try {
        // const filePath = path.join(
        //     process.cwd(),
        //     "files",
        //     "item.xlsx"
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

        const coaList = await getAccounts(apiKey);

        const results = [];
        const successItems = [];
        const failedItems = [];

        for (const row of excelData) {
            console.log("row", row)
            try {
                let appliesToPurchase =
                    row["appliesToPurchase"] === true ||
                    String(row["appliesToPurchase"] || "")
                        .trim()
                        .toUpperCase() === "TRUE";

                let appliesToSale =
                    row["appliesToSale"] === true ||
                    String(row["appliesToSale"] || "")
                        .trim()
                        .toUpperCase() === "TRUE";

                // Auto enable if account names exist
                if (
                    row["purchaseItemName"] &&
                    !appliesToPurchase
                ) {
                    appliesToPurchase = true;
                }

                if (
                    row["saleItemName"] &&
                    !appliesToSale
                ) {
                    appliesToSale = true;
                }

                // Purchase COA
                const purchaseAccount =
                    coaList.find(
                        (acc) =>
                            acc.name
                                ?.trim()
                                .toLowerCase() ===
                            String(
                                row["purchaseItemName"] || ""
                            )
                                .trim()
                                .toLowerCase()
                    );

                // Sale COA
                const saleAccount =
                    coaList.find(
                        (acc) =>
                            acc.name
                                ?.trim()
                                .toLowerCase() ===
                            String(
                                row["saleItemName"] || ""
                            )
                                .trim()
                                .toLowerCase()
                    );

                const payload = {
                    itemCode:
                        row["itemCode*"]
                            ?.toString()
                            .trim(),

                    internalName:
                        row["internalName*"]
                            ?.toString()
                            .trim(),

                    itemCategory:
                        row["itemCategory"]
                            ?.toString()
                            .trim() ||
                        "NON_INVENTORY",

                    appliesToPurchase,
                    appliesToSale,

                    blockInsufficientDeductions:
                        row["blockInsufficientDeductions"] === true ||
                        String(
                            row["blockInsufficientDeductions"] || ""
                        )
                            .trim()
                            .toUpperCase() === "TRUE",

                    ...(row["unit"] && {
                        unit: row["unit"]
                            .toString()
                            .trim(),
                    }),

                    ...(row["costingMethod"] && {
                        costingMethod:
                            row["costingMethod"]
                                .toString()
                                .trim(),
                    }),

                    tags: row["tags"]
                        ? row["tags"]
                            .toString()
                            .split(",")
                            .map((tag) => tag.trim())
                        : [],
                };

                // PURCHASE
                if (appliesToPurchase) {
                    payload.purchaseItemName =
                        row["purchaseItemName"]
                            ?.toString()
                            .trim();

                    payload.purchaseItemPrice =
                        Number(
                            row["purchaseItemPrice"] || 0
                        );

                    if (purchaseAccount) {
                        payload.purchaseAccountResourceId =
                            purchaseAccount.resourceId;
                    }
                }

                // SALE
                if (appliesToSale) {
                    payload.saleItemName =
                        row["saleItemName"]
                            ?.toString()
                            .trim();

                    payload.salePrice =
                        Number(
                            row["salePrice"] || 0
                        );

                    if (saleAccount) {
                        payload.saleAccountResourceId =
                            saleAccount.resourceId;
                    }
                }

                if (row["purchaseTaxProfile"]) {
                    payload.purchaseTaxProfile =
                        row["purchaseTaxProfile"]
                            .toString()
                            .trim();
                }

                if (row["saleTaxProfile"]) {
                    payload.saleTaxProfile =
                        row["saleTaxProfile"]
                            .toString()
                            .trim();
                }

                console.log(
                    "Purchase COA =>",
                    purchaseAccount?.name,
                    purchaseAccount?.resourceId
                );

                console.log(
                    "Sale COA =>",
                    saleAccount?.name,
                    saleAccount?.resourceId
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
                        "https://api.getjaz.com/api/v1/items",
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
                    status: "success",
                    itemCode: payload.itemCode,
                    data: response.data,
                });

                successItems.push({
                    itemCode: payload.itemCode,
                    internalName: payload.internalName,
                });


            } catch (error) {

                const errorData =
                    error.response?.data ||
                    error.message;

                results.push({
                    status: "failed",
                    itemCode: row["itemCode*"],
                    internalName:
                        row["internalName*"],
                    error: errorData,
                });

                failedItems.push({
                    itemCode: row["itemCode*"],
                    internalName:
                        row["internalName*"],
                    error: errorData,
                });

            }
        }

        // return res.status(200).json({
        //     success: true,
        //     total: excelData.length,
        //     results,
        // });


        return res.status(200).json({
            success: true,

            totalRecords: excelData.length,

            successCount: successItems.length,

            failedCount: failedItems.length,

            successItems,

            failedItems,

            results
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


const item = { createItem }

export default item