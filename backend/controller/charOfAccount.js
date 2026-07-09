import axios from "axios";
import XLSX from "xlsx";
import path from "path";

// create coa
const createChartOfAccount = async (req, res) => {
  try {
     console.log("routs hit")
    const apiKey = req.body?.apiKey;
    console.log("apiKey", apiKey);
    console.log("req body", req.body);

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: "apiKey is missing in request body",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "file is missing in request",
      });
    }

    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const excelData = XLSX.utils.sheet_to_json(worksheet);
    const results = [];

    for (const item of excelData) {
      // Required fields
      const payload = {
        name: item.Name,
        classificationType: item.classificationType,
      };
      // Optional fields - only add if value exists
      if (item.Code) {
        payload.code = String(item.Code);
      }
      if (item.currencyCode) {
        payload.currencyCode = String(item.currencyCode).trim();
      }
      if (item.Description) {
        payload.description = item.Description;
      }
      if (item.accountType) {
        payload.accountType = item.accountType;
      }
      if (
        item.balance !== undefined &&
        item.balance !== null &&
        item.balance !== ""
      ) {
        payload.balance = Number(item.balance);
      }

      try {
        console.log("Sending Payload:", JSON.stringify(payload, null, 2));
        const response = await axios.post(
          "https://api.getjaz.com/api/v1/chart-of-accounts",
          payload,
          {
            headers: {
              "x-jk-api-key": apiKey,
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );
        results.push({
          name: payload.name,
          status: "success",
          data: response.data,
        });
      } catch (error) {
        console.error(`Error for ${payload.name}:`, error.response?.data || error.message);
        results.push({
          name: payload.name,
          status: "failed",
          error: error.response?.data || error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      totalRecords: excelData.length,
      successCount: results.filter((r) => r.status === "success").length,
      failedCount: results.filter((r) => r.status === "failed").length,
      results,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// delete coa
const deleteChartOfAccountService = async (resourceId, apiKey) => {
  const response = await axios.delete(
    `https://api.getjaz.com/api/v1/chart-of-accounts/${resourceId}`,
    {
      headers: {
        accept: "application/json",
        "x-jk-api-key": apiKey,
      },
    }
  );
  return response.data;
};

const deleteChartOfAccount = async (req, res) => {
  try {
    const { resourceId } = req.params;
    console.log("resourceId", resourceId);
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        message: "resourceId is required",
      });
    }
    const result = await deleteChartOfAccountService(
      resourceId,
      process.env.JAZ_API_KEY
    );
    return res.status(200).json({
      success: true,
      message: "Chart of Account deleted successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      success: false,
      message:
        error.response?.data?.message || error.message || "Something went wrong",
    });
  }
};

const getChartOfAccounts = async (req, res) => {
  try {
    let allAccounts = [];
    let offset = 0;
    const limit = 1000;
    while (true) {
      const response = await axios.get(
        "https://api.getjaz.com/api/v1/chart-of-accounts",
        {
          params: {
            limit,
            offset,
          },
          headers: {
            "x-jk-api-key": process.env.JAZ_API_KEY,
            Accept: "application/json",
          },
        }
      );
      const records = response.data?.data || [];
      console.log("records.length", records.length);
      allAccounts.push(...records);
      console.log(`Fetched ${records.length} records at offset ${offset}`);
      if (records.length < limit) {
        break;
      }
      offset += 1;
    }
    return res.status(200).json({
      total: allAccounts.length,
      accounts: allAccounts,
    });
  } catch (error) {
    console.error("getChartOfAccounts Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const chartOfAccount = {
  createChartOfAccount,
  deleteChartOfAccount,
  getChartOfAccounts,
};
export default chartOfAccount;
