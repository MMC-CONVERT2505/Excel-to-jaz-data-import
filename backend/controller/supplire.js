import axios from "axios";
import XLSX from "xlsx";
import path from "path";



// ADD SUPPLIRE 

const formatPhoneNumber = (phone) => {
  if (!phone) return undefined;

  // sirf digits rakho
  let cleaned = String(phone).replace(/\D/g, "");

  // India ke 10 digit mobile number
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }

  // agar already country code hai
  if (!cleaned.startsWith("+")) {
    cleaned = `+${cleaned}`;
  }

  return cleaned;
};

const formatEmail = (email) => {
  if (!email) return undefined;

  const cleaned = String(email).trim().toLowerCase();

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(cleaned)
    ? cleaned
    : undefined;
};



const createSupplier = async (req, res) => {
  try {
    // const filePath = path.join(
    //   process.cwd(),
    //   "files",
    //   "supplier.xlsx"
    // );

    const { apiKey } = req.body

    console.log("apikey", apiKey)

    // const workbook = XLSX.readFile(filePath);
    const workbook = XLSX.read(req.file.buffer, {
      type: "buffer",
    });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const excelData = XLSX.utils.sheet_to_json(worksheet);

    const successSupplier = [];
    const results = [];

    for (const row of excelData) {
      console.log("row", row)
      const payload = {
        billingName: row["Billing name"],
        email: formatEmail(row["Email*"]),
        phone: formatPhoneNumber(row["Phone*"] || row["phone"]),
        name: row["name*"],
        customer: row["customer*"],
        supplier: row["supplier*"],
        // billingAddress: {
        //   addressLine1: row["address line 1"],
        //   addressLine2: row["address line 2"],
        //   city: row["city"],
        //   country: row["country*"],
        //   postalCode: row["postal code"],
        //   state: row["state"]
        // }

      };


      // console.log("Creating Customer:", payload.name);
      console.log("Payload:", payload);

      try {
        const response = await axios.post(
          "https://api.getjaz.com/api/v1/contacts",
          payload,
          {
            headers: {
              accept: "application/json",
              "content-type": "application/json",
              "x-jk-api-key": apiKey,
            },
          }
        );

        console.log(
          `Supplier Created Successfully: ${payload.name}`
        );

        successSupplier.push({
          name: payload.name,
          id: response.data?.id,
          data: response.data,
        });
      } catch (error) {
        const errorMessage =
          error?.response?.data ||
          error?.message ||
          "Unknown Error";

        console.log(
          ` Supplier Creation Failed: ${payload.name}`
        );
        console.log("Reason:", errorMessage);

        results.push({
          name: payload.name,
          payload,
          error: errorMessage,
        });
      }
    }

    return res.status(200).json({
      success: true,
      totalRecords: excelData.length,
      successCount: successSupplier.length,
      failedCount: results.length,
      successfulSupplier: successSupplier,
      results,
    });
  } catch (error) {
    console.error(
      "File Processing Error:",
      error?.message || error
    );

    return res.status(500).json({
      success: false,
      message: error?.message || "Something went wrong",
    });
  }
};




// DELETE SUPPLIRE 
const deleteSupplireService = async (supplireId, apiKey) => {
  const response = await axios.delete(
    `https://api.getjaz.com/api/v1/contacts/${supplireId}`,
    {
      headers: {
        accept: "application/json",
        "x-jk-api-key": apiKey,
      },
    }
  );

  return response.data;
};


const deleteSupplire = async (req, res) => {
  try {
    const { supplireId } = req.params;

    console.log("supplireId:", supplireId);

    if (!supplireId) {
      return res.status(400).json({
        success: false,
        message: "supplireId is required",
      });
    }

    const result = await deleteSupplireService(
      supplireId,
      process.env.JAZ_API_KEY
    );

    return res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "Delete Supplier Error:",
      error.response?.data || error.message
    );

    return res.status(error.response?.status || 500).json({
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  }
};



const getSuppliers = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.getjaz.com/api/v1/contacts?limit=1000&view=full",
      {
        headers: {
          Accept: "application/json",
          "x-jk-api-key": process.env.JAZ_API_KEY,
        },
      }
    );

    const contacts = response.data?.data || response.data || [];

    const suppliers = contacts.filter(
      (contact) =>
        contact.isSupplier === true ||
        contact.supplier === true ||
        contact.contactType === "supplier"
    );


    return res.status(200).json({
      success: true,
      total: suppliers.length || 0,
      data: suppliers.map(item => ({
        name: item.name,
        resourceId: item.resourceId
      }))
    });




  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.response?.data || error.message,
    });
  }
};



const supplire = { createSupplier, deleteSupplire, getSuppliers }

export default supplire






