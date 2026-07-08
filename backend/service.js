import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// All routes
import chartOfAccountRoute from "./routes/chartOfAccountRoute.js"
import supplireRoute from "./routes/supplireRoute.js"
import customerRoute from "./routes/customerRoute.js"
import journalRoute from "./routes/journalRoute.js"
import bankTranseferRoute from "./routes/bankTransferRoute.js"
import cashOutRoute from "./routes/cashOutRoute.js"
import cashInRoute from "./routes/cashInRoute.js"
import tagRoute from "./routes/tagRoute.js"
import itemRoute from "./routes/itemRoute.js"
import taxProfileRoute from "./routes/taxProfileRoute.js"
import billRoute from "./routes/billRoute.js"
import invoiceRoute from "./routes/invoiceRoute.js"
import customerCreditNoteRoute from "./routes/customerCreditNoteRoute.js"
import supplireCreditNoteRoute from "./routes/supplireCreditNoteRoute.js"
import invoicePaymentRoute from "./routes/invoicePaymentRoute.js"
import billPaymentRoute from "./routes/billPaymentRoute.js"


dotenv.config();

const app = express();


// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4401",
    credentials: true,
  })
); 


app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Server is running successfully",
  });
});



// coa routes
app.use("/", chartOfAccountRoute)

// supplire routes
app.use("/", supplireRoute)

// customer routes
app.use("/", customerRoute)

// journal routes
app.use("/", journalRoute)

// bank transfer routes
app.use("/", bankTranseferRoute)

// cash up routes
app.use("/", cashOutRoute)

// cash in routes
app.use("/", cashInRoute)

// tag routes
app.use("/", tagRoute)

// item routes
app.use("/", itemRoute)

// tax profile routes
app.use("/", taxProfileRoute)

// bill routes
app.use("/", billRoute)

// invoice routes
app.use("/", invoiceRoute)

// customer credit Note routes
app.use("/", customerCreditNoteRoute)

// supplire credit Note routes
app.use("/", supplireCreditNoteRoute)


// invoice payment routes
app.use("/", invoicePaymentRoute)

// bill payment routes
app.use("/", billPaymentRoute)



app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal Server Error",
  });
});



// Start Server
const PORT = process.env.PORT || 4411;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});