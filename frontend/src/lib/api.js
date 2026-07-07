
import axios from "axios"

// const BASE_URL = "http://localhost:5000";
const BASE_URL = __BASE_URL__;

const MOCK_MODULES = [
  { id: "charofaccount", name: "Chart Of Account" },
  { id: "supplire", name: "Suppliers" },
  { id: "customer", name: "Customers" },
  { id: "item", name: "Items" },
  { id: "cashIn", name: "Cash In" },
  { id: "cashout", name: "Cash Out" },
  { id: "bill", name: "Bills" },
  { id: "invoice", name: "Invoices" },
  { id: "invoice-payment", name: "Invoice Payments" },
  { id: "customer-credit-note", name: "Customer Credit Notes" },
  { id: "supplier-credit-note", name: "Supplier Credit Notes" },
  { id: "bank-transfer", name: "Bank Transfers" },
  { id: "bill-payment", name: "Bill Payments" },
  { id: "journal", name: "Journal" },
  { id: "tag", name: "Tags" },
  { id: "tax-profile", name: "Taxes" },
];




export function apiFetchModules() {
  // Real version:
  // return fetch('/api/jaz/modules', { headers: { Authorization: `Bearer ${apiKey}` }}).then(r => r.json());
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_MODULES), 700));
}


export async function apiSubmitMigration(
  { apiKey, endpoint, file, totalRows },
  onProgress
) {
  try {
    const formData = new FormData();

    formData.append("apiKey", apiKey);
    formData.append("sheet", file); 
    formData.append("totalRows", totalRows);

    console.log("endpoint", endpoint)

    const { data } = await axios.post(
      `${BASE_URL}${endpoint}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            onProgress(progressEvent.loaded, progressEvent.total);
          }
        },
      }
    );


    return data;
  } catch (error) {
    console.error("Migration Error:", error);

    if (axios.isAxiosError(error)) {
      const response = error.response?.data || {};

      return {
        total: response.total || totalRows,
        success: response.success || 0,
        failed: response.failed || 0,
        timeTakenSec: response.timeTakenSec || 0,
        failedRecords: response.failedRecords || [],
        message: response.message || "Migration failed",
      };
    }

    return {
      total: totalRows,
      success: 0,
      failed: totalRows,
      timeTakenSec: 0,
      failedRecords: [
        {
          ref: "-",
          reason: "Something went wrong",
          status: "Failed",
        },
      ],
      message: "Something went wrong",
    };
  }
}
