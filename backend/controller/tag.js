import axios from "axios";
import XLSX from "xlsx";
import path from "path";

// ADD Tag

const createTag = async (req, res) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "files",
      "tag.xls"
    );

    const workbook = XLSX.readFile(filePath);
    const worksheet =
      workbook.Sheets[workbook.SheetNames[0]];

    const excelData =
      XLSX.utils.sheet_to_json(worksheet);

    const results = [];

    for (const row of excelData) {
      console.log("row", row)
      try {
        const payload = {
          tagName: row["tagName*"]?.toString().trim(),
        };

        if (!payload.tagName) {
          results.push({
            status: "failed",
            reason: "tagName is missing",
            row,
          });
          continue;
        }

        const response = await axios.post(
          "https://api.getjaz.com/api/v1/tags",
          payload,
          {
            headers: {
              "x-jk-api-key":
                process.env.JAZ_API_KEY,
              "Content-Type":
                "application/json",
              Accept: "application/json",
            },
          }
        );

        results.push({
          status: "success",
          tagName: payload.tagName,
          data: response.data,
        });
      } catch (error) {
        results.push({
          status: "failed",
          tagName: row.tagName,
          error:
            error.response?.data ||
            error.message,
        });
      }
    }

    return res.status(200).json({
      success: true,
      total: excelData.length,
      results,
    });
  } catch (error) {
    console.error("Create Tag Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const tag = { createTag }

export default tag
