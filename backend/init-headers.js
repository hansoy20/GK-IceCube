require("dotenv").config();
const { google } = require("googleapis");

async function initHeaders() {
  try {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const tabName = process.env.GOOGLE_SHEETS_TAB_NAME || "Sheet1";

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.warn("Google Sheets credentials missing.");
      return;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const headers = [
      "Order Number",
      "Customer Name",
      "Email Address",
      "Phone Number",
      "Delivery Address",
      "Quantity (kg)",
      "Price/kg",
      "Total Price",
      "Status",
      "Order Notes",
      "Requested Delivery Date",
      "Requested Delivery Time",
      "Date Placed"
    ];

    // First insert the empty row 1 just to be safe, then apply headers and format
    // Actually we can just update A1:M1. Wait, if we use values.update, it overrides row 1.
    // If row 1 already has an order, the user will lose it. 
    // It's safer to insert a row at the top, then format it.
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            insertDimension: {
              range: {
                sheetId: 0, // Assuming Sheet1 is ID 0
                dimension: "ROWS",
                startIndex: 0,
                endIndex: 1,
              },
              inheritFromBefore: false,
            }
          }
        ]
      }
    });

    // Write the headers to A1:M1
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1:M1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [headers],
      },
    });

    // Format headers (bold and background color)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 13,
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                  textFormat: { bold: true },
                  horizontalAlignment: "CENTER",
                },
              },
              fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
            },
          },
        ],
      },
    });

    console.log("Headers successfully added to Google Sheet!");
  } catch (err) {
    console.error("Error setting headers:", err);
  }
}

initHeaders();
