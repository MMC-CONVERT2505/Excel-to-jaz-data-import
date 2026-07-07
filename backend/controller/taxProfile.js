import axios from "axios";
import XLSX from "xlsx";
import path from "path";
import { error } from "console";

// ADD tax profile

const createTaxProfile = async (req, res) => {
  try {
    // const filePath = path.join(
    //   process.cwd(),
    //   "files",
    //   "taxprofile.xlsx"
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

    const results = [];

    for (const row of excelData) {
      console.log("row =>", row);

      try {
        const payload = {
          description:
            row["description"]?.toString().trim(),

          name:
            row["name"]?.toString().trim(),

          taxRate: Number(
            row["taxRate"] || 0
          ),

          taxTypeCode:
            row["taxTypeCode"]
              ?.toString()
              .trim(),

          // withholdingValue: Number(
          //   row["withholdingValue"] || 0
          // ),
        };

  
        // Required field validation
        if (!payload.description) {
          results.push({
            status: "failed",
            error: "description is missing",
            name: row["name"],
          });
          continue;
        }

        if (!payload.name) {
          results.push({
            status: "failed",
            error: "name is missing",
            name: row["name"],
          });
          continue;
        }

        if (!payload.taxTypeCode) {
          results.push({
            status: "failed",
            error: "taxTypeCode is missing",
            name: row["name"],
          });
          continue;
        }

        if (
          payload.taxRate < 0 ||
          payload.taxRate > 100
        ) {
          results.push({
            status: "failed",
            error:
              "taxRate must be between 0 and 100",
            name: row["name"],
          });
          continue;
        }

        if (
          payload.withholdingValue < 0 ||
          payload.withholdingValue > 100
        ) {
          results.push({
            status: "failed",
            error:
              "withholdingValue must be between 0 and 100",
            name: row["name"],
          });
          continue;
        }

        console.log("payload", payload)

        const response = await axios.post(
          "https://api.getjaz.com/api/v1/tax-profiles",
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
          name: payload.name,
          data: response.data,
        });
      } catch (error) {
        results.push({
          status: "failed",
          name: row["name"],
          error:
            error.response?.data ||
            error.message,
        });
      }
    }

    return res.status(200).json({
      totalRecords: excelData.length,
      successCount: results.filter(
        (r) => r.status === "success"
      ).length,
      failedCount: results.filter(
        (r) => r.status === "failed"
      ).length,
      results,
    });
  } catch (error) {
    console.error(
      "Create Tax Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getTaxProfiles = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.getjaz.com/api/v1/tax-profiles",
      {
        params: {
          limit: 1000,
          offset: 0,
        },
        headers: {
          "x-jk-api-key": process.env.JAZ_API_KEY,
          "accept": "application/json",
        },
      }
    );


    const taxProfiles = (response.data?.data || []).map((item) => ({
      name: item.name,
      vatValue: item.vatValue,
      resourceId: item.resourceId,
    }));

    return res.status(200).json({
      success: true,
      total: taxProfiles.length,
      data: taxProfiles,
    });


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};


const taxProfile = { createTaxProfile, getTaxProfiles }

export default taxProfile
