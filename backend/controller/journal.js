import axios from "axios";
import XLSX from "xlsx";
import path from "path";


import getAccounts from "./getController/getChartOfAccount.js"



// ADD JOURNAL 

// const createJournal = async (req, res) => {
//   try {
//     const filePath = path.join(
//       process.cwd(),
//       "files",
//       "coaTestingFile.xlsx"
//     );

//     const workbook = XLSX.readFile(filePath);
//     const worksheet =
//       workbook.Sheets[workbook.SheetNames[0]];

//     const excelData = XLSX.utils.sheet_to_json(
//       worksheet
//     );

//     // Fetch COA Accounts
//     const coaResponse = await axios.get(
//       "https://api.getjaz.com/api/v1/chart-of-accounts?limit=1000",
//       {
//         headers: {
//           accept: "application/json",
//           "x-jk-api-key": process.env.JAZ_API_KEY,
//         },
//       }
//     );

//     const coaAccounts =
//       coaResponse.data?.data ||
//       coaResponse.data?.results ||
//       [];


//     // console.log("account", coaAccounts.length)
//     // console.log("account", coaAccounts)

//     const excelDateToJSDate = (serial) => {
//       const utcDays = Math.floor(serial - 25569);
//       const utcValue = utcDays * 86400;

//       return new Date(utcValue * 1000)
//         .toISOString()
//         .split("T")[0];
//     };

//     const groupedJournals = {};

//     // Group Journals by Reference
//     for (const row of excelData) {
//       const reference = row["reference*"];

//       if (!groupedJournals[reference]) {
//         groupedJournals[reference] = {
//           reference,
//           valueDate: excelDateToJSDate(
//             Number(row["valueDate*"])
//           ),
//           saveAsDraft:
//             row["saveAsDraft*"] ?? true,
//           taxInclusion:
//             row["taxInclusion"] ?? false,
//           taxVatApplicable:
//             row["taxVatApplicable*"] ?? false,
//           journalEntries: [],
//         };
//       }

//       // Match account name from COA
//       const account = coaAccounts.find(
//         (acc) =>
//           acc.name?.trim().toLowerCase() ===
//           String(
//             row["accountName"] || ""
//           )
//             .trim()
//             .toLowerCase()
//       );

//       if (!account) {
//         console.log(
//           `❌ Account Not Found In COA: ${row["accountName"]}`
//         );
//       }

//       groupedJournals[reference].journalEntries.push({
//         accountResourceId:
//           account?.resourceId || null,
//         amount: Number(
//           Number(row["amount*"]).toFixed(2)
//         ),
//         description:
//           row["description"] || "",
//         type: String(
//           row["type*"]
//         ).toUpperCase(),
//       });
//     }

//     const success = [];
//     const failed = [];

//     for (const payload of Object.values(
//       groupedJournals
//     )) {
//       try {
//         if (
//           payload.journalEntries.length < 2
//         ) {
//           throw new Error(
//             "Journal must contain at least 2 entries"
//           );
//         }

//         const invalidAccounts =
//           payload.journalEntries.filter(
//             (entry) =>
//               !entry.accountResourceId
//           );

//         if (invalidAccounts.length) {
//           throw new Error(
//             "One or more account names could not be mapped to JAZ COA"
//           );
//         }

//         // Calculate totals
//         const totalDebit = Number(
//           payload.journalEntries
//             .filter(
//               (e) => e.type === "DEBIT"
//             )
//             .reduce(
//               (sum, e) =>
//                 sum + Number(e.amount),
//               0
//             )
//             .toFixed(2)
//         );

//         const totalCredit = Number(
//           payload.journalEntries
//             .filter(
//               (e) => e.type === "CREDIT"
//             )
//             .reduce(
//               (sum, e) =>
//                 sum + Number(e.amount),
//               0
//             )
//             .toFixed(2)
//         ); 


//         console.log(
//           "\n=============================="
//         );
//         console.log(
//           "Reference:",
//           payload.reference
//         );
//         console.log(
//           "Debit Total:",
//           totalDebit
//         );
//         console.log(
//           "Credit Total:",
//           totalCredit
//         );

//         if (
//           totalDebit !== totalCredit
//         ) {
//           throw new Error(
//             `Debit (${totalDebit}) and Credit (${totalCredit}) are not equal`
//           );
//         }

//         console.log("Diff:", totalDebit - totalCredit);

//         console.log(
//           "Journal Payload:",
//           JSON.stringify(
//             payload,
//             null,
//             2
//           )
//         );

//         const response = await axios.post(
//           "https://api.getjaz.com/api/v1/journals",
//           payload,
//           {
//             headers: {
//               accept: "application/json",
//               "content-type":
//                 "application/json",
//               "x-jk-api-key":
//                 process.env.JAZ_API_KEY,
//             },
//           }
//         );

//         console.log(
//           `✅ Journal Created: ${payload.reference}`
//         );

//         success.push({
//           reference:
//             payload.reference,
//           data: response.data,
//         });
//       } catch (error) {
//         console.log(
//           `❌ Journal Failed: ${payload.reference}`
//         );

//         console.log(
//           "Reason:",
//           error.response?.data ||
//             error.message
//         );

//         failed.push({
//           reference:
//             payload.reference,
//           reason:
//             error.response?.data ||
//             error.message,
//         });
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       totalJournals:
//         Object.keys(groupedJournals)
//           .length,
//       successCount: success.length,
//       failedCount: failed.length,
//       success,
//       failed,
//     });
//   } catch (error) {
//     console.error(
//       "Journal Import Error:",
//       error.message
//     );

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// const createJournal = async (req, res) => {
//   try {
//     const filePath = path.join(
//       process.cwd(),
//       "files",
//       "journaltestingfile.xlsx"
//     );

//     const workbook = XLSX.readFile(filePath);
//     const worksheet =
//       workbook.Sheets[workbook.SheetNames[0]];

//     const excelData = XLSX.utils.sheet_to_json(
//       worksheet
//     );

//     const excelDateToJSDate = (serial) => {
//       const utcDays = Math.floor(
//         Number(serial) - 25569
//       );
//       const utcValue = utcDays * 86400;

//       return new Date(utcValue * 1000)
//         .toISOString()
//         .split("T")[0];
//     };

//     const groupedJournals = {};

//     // Group by Reference
//     for (const row of excelData) {
//       console.log("row", row);

//       const reference = row["reference*"];

//       if (!reference) continue;

//       if (!groupedJournals[reference]) {
//         groupedJournals[reference] = {
//           reference,
//           valueDate: excelDateToJSDate(
//             row["valueDate*"]
//           ),
//           saveAsDraft:
//             row["saveAsDraft*"] ?? false,
//           taxInclusion:
//             row["taxInclusion"] ?? false,
//           taxVatApplicable:
//             row["taxVatApplicable*"] ?? false,
//           journalEntries: [],
//         };
//       }

//       groupedJournals[
//         reference
//       ].journalEntries.push({
//         accountResourceId:
//           row["accountResourceId*"] || null,
//         amount: Number(
//           Number(
//             row["amount*"] || 0
//           ).toFixed(2)
//         ),
//         description:
//           row["description"] || "",
//         type: String(
//           row["type*"] || ""
//         ).toUpperCase(),
//         // add this 
//         taxProfileResourceId:
//           row["taxProfileResourceId"]?.toString().trim() || undefined,
//       });
//     }



//     const success = [];
//     const failed = [];

//     for (const payload of Object.values(
//       groupedJournals
//     )) {
//       try {
//         if (
//           payload.journalEntries.length < 2
//         ) {
//           throw new Error(
//             "Journal must contain at least 2 entries"
//           );
//         }

//         const invalidAccounts =
//           payload.journalEntries.filter(
//             (entry) =>
//               !entry.accountResourceId
//           );

//         if (invalidAccounts.length) {
//           throw new Error(
//             "Missing accountResourceId in one or more journal entries"
//           );
//         }

//         const totalDebit = Number(
//           payload.journalEntries
//             .filter(
//               (e) => e.type === "DEBIT"
//             )
//             .reduce(
//               (sum, e) =>
//                 sum + Number(e.amount),
//               0
//             )
//             .toFixed(2)
//         );

//         const totalCredit = Number(
//           payload.journalEntries
//             .filter(
//               (e) => e.type === "CREDIT"
//             )
//             .reduce(
//               (sum, e) =>
//                 sum + Number(e.amount),
//               0
//             )
//             .toFixed(2)
//         );

//         console.log(
//           "\n=============================="
//         );
//         console.log(
//           "Reference:",
//           payload.reference
//         );
//         console.log(
//           "Debit Total:",
//           totalDebit
//         );
//         console.log(
//           "Credit Total:",
//           totalCredit
//         );

//         if (
//           totalDebit !== totalCredit
//         ) {
//           throw new Error(
//             `Debit (${totalDebit}) and Credit (${totalCredit}) are not equal`
//           );
//         }

//         console.log(
//           "Journal Payload:"
//         );
//         console.log(
//           JSON.stringify(
//             payload,
//             null,
//             2
//           )
//         );

//         const response = await axios.post(
//           "https://api.getjaz.com/api/v1/journals",
//           payload,
//           {
//             headers: {
//               accept: "application/json",
//               "content-type":
//                 "application/json",
//               "x-jk-api-key":
//                 process.env.JAZ_API_KEY,
//             },
//           }
//         );

//         console.log(
//           `✅ Journal Created: ${payload.reference}`
//         );

//         success.push({
//           reference:
//             payload.reference,
//           data: response.data,
//         });
//       } catch (error) {
//         console.log(
//           `❌ Journal Failed: ${payload.reference}`
//         );

//         console.log(
//           "Reason:",
//           error.response?.data ||
//           error.message
//         );

//         failed.push({
//           reference:
//             payload.reference,
//           reason:
//             error.response?.data ||
//             error.message,
//         });
//       }
//     }

//     return res.status(200).json({
//       success: true,
//       totalJournals:
//         Object.keys(groupedJournals)
//           .length,
//       successCount: success.length,
//       failedCount: failed.length,
//       success,
//       failed,
//     });
//   } catch (error) {
//     console.error(
//       "Journal Import Error:",
//       error.message
//     );

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// id working code 


const createJournal = async (req, res) => {
  try {
    // const filePath = path.join(
    //   process.cwd(),
    //   "files",
    //   "journaltestingfile.xlsx"
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

    // Fetch COA
    const accounts = await getAccounts(apiKey);

    // Common function for Account Name -> ResourceId
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

    const excelDateToJSDate = (serial) => {
      const utcDays = Math.floor(
        Number(serial) - 25569
      );
      const utcValue = utcDays * 86400;

      return new Date(utcValue * 1000)
        .toISOString()
        .split("T")[0];
    };

    const groupedJournals = {};

    // Group by Reference
    for (const row of excelData) {
      console.log("row", row)
      // const reference = row["reference*"];
      const reference =
        row["reference*"] != null
          ? String(row["reference*"]).replace(/\*/g, "").trim()
          : "";

      if (!reference) continue;

      if (!groupedJournals[reference]) {
        groupedJournals[reference] = {
          reference,
          valueDate: excelDateToJSDate(
            row["valueDate*"]
          ),
          saveAsDraft:
            row["saveAsDraft*"] ?? false,
          taxInclusion:
            row["taxInclusion"] ?? false,
          taxVatApplicable:
            row["taxVatApplicable*"] ??
            false,
          journalEntries: [],
        };
      }

      // Account Name Mapping
      const accountResourceId = findId(
        accounts,
        row["account name"]
      );

      if (!accountResourceId) {
        throw new Error(
          `Account not found : ${row["account name"]}`
        );
      }

      groupedJournals[
        reference
      ].journalEntries.push({
        accountResourceId,
        amount: Number(
          Number(
            row["amount*"] || 0
          ).toFixed(2)
        ),
        description:
          row["description"] || "",
        type: String(
          row["type*"] || ""
        ).toUpperCase(),
        taxProfileResourceId:
          row[
            "taxProfileResourceId"
          ]
            ?.toString()
            .trim() || undefined,
      });
    }

    const results = [];
    const failed = [];

    for (const payload of Object.values(
      groupedJournals
    )) {
      try {
        if (
          payload.journalEntries.length < 2
        ) {
          throw new Error(
            "Journal must contain at least 2 entries"
          );
        }

        const totalDebit = Number(
          payload.journalEntries
            .filter(
              (e) =>
                e.type ===
                "DEBIT"
            )
            .reduce(
              (sum, e) =>
                sum +
                Number(
                  e.amount
                ),
              0
            )
            .toFixed(2)
        );

        const totalCredit = Number(
          payload.journalEntries
            .filter(
              (e) =>
                e.type ===
                "CREDIT"
            )
            .reduce(
              (sum, e) =>
                sum +
                Number(
                  e.amount
                ),
              0
            )
            .toFixed(2)
        );

        if (
          totalDebit !== totalCredit
        ) {
          throw new Error(
            `Debit (${totalDebit}) and Credit (${totalCredit}) are not equal`
          );
        }

        console.log(
          "Journal Payload:",
          JSON.stringify(
            payload,
            null,
            2
          )
        );

        const response =
          await axios.post(
            "https://api.getjaz.com/api/v1/journals",
            payload,
            {
              headers: {
                accept:
                  "application/json",
                "content-type":
                  "application/json",
                "x-jk-api-key":
                   apiKey,
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
            error.response?.data ||
            error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      totalRows: excelData.length,
      totalRecords:
        Object.keys(
          groupedJournals
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
      message: error.message,
    });
  }
};

const journal = { createJournal }

export default journal
