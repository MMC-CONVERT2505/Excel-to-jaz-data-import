import axios from "axios";
import XLSX from "xlsx";
import path from "path";



// ADD customer 
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

const createCustomer = async (req, res) => {
  try {
    // const filePath = path.join(
    //   process.cwd(),
    //   "files",
    //   "customer.xlsx"
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

    const successCustomers = [];
    const results = [];

    for (const row of excelData) {
      console.log("row", row)
      const payload = {
        billingName: row["Billing name*"],
        email: formatEmail(row["Email*"]),
        phone: formatPhoneNumber(row["Phone*"] || row["phone"]),
        name: row["name*"],
        customer: row["customer*"],
        supplier: row["supplier*"],
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
          `Customer Created Successfully: ${payload.name}`
        );

        successCustomers.push({
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
          ` Customer Creation Failed: ${payload.name}`
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
      successCount: successCustomers.length,
      failedCount: results.length,
      successfulCustomers: successCustomers,
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




// DELETE customer 
const deleteCustomerService = async (customerId, apiKey) => {
  const response = await axios.delete(
    `https://api.getjaz.com/api/v1/contacts/${customerId}`,
    {
      headers: {
        accept: "application/json",
        "x-jk-api-key": apiKey,
      },
    }
  );

  return response.data;
};


const deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    console.log("customerId:", customerId);

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "customerId is required",
      });
    }

    const result = await deleteCustomerService(
      customerId,
      process.env.JAZ_API_KEY
    );

    return res.status(200).json({
      success: true,
      message: "Customer deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "Delete Customer Error:",
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


const getCustomer = async (req, res) => {
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

    const customers = contacts.filter(
      (contact) =>
        contact.isCustomer === true ||
        contact.customer === true ||
        contact.contactType === "customer"
    );

    // return res.status(200).json({
    //   success: true,
    //   count: customers.length,
    //   data: customers,
    // });


    return res.status(200).json({
      success: true,
      total: customers.length || 0,
      data: customers.map(item => ({
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


const customer = { createCustomer, deleteCustomer, getCustomer }

export default customer






