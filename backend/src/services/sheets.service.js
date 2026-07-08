const { google } = require("googleapis");

/**
 * Appends a new order row to Google Sheets.
 * @param {Object} order The order object from Prisma.
 */
async function appendOrderToSheet(order) {
  try {
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const tabName = process.env.GOOGLE_SHEETS_TAB_NAME || "Sheet1";

    if (!clientEmail || !privateKey || !spreadsheetId) {
      console.warn("Google Sheets credentials missing. Skipping sync.");
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

    const address = order.deliveryLine1 || "";

    // For a multi-item order, calculate total quantity and format total
    const quantityKg = order.items?.reduce((acc, item) => acc + Number(item.quantityKg), 0) || 0;
    // Assuming single product type for price/kg (since they only sell ice)
    const pricePerKg = order.items?.[0]?.unitPrice ? Number(order.items[0].unitPrice) : 0;
    
    // Requested Delivery Date formatted safely
    const requestedDateStr = order.requestedDeliveryDate
      ? new Date(order.requestedDeliveryDate).toLocaleDateString("en-US", { timeZone: "UTC" })
      : "";

    // Placed Date formatted safely
    const placedDateStr = order.createdAt ? new Date(order.createdAt).toLocaleString("en-US") : "";

    const values = [
      [
        order.orderNumber,
        order.customerName,
        order.customerEmail,
        order.contactPhone,
        address,
        quantityKg,
        pricePerKg,
        Number(order.total),
        order.status,
        order.orderNotes || "",
        requestedDateStr,
        order.deliveryTime || "",
        placedDateStr,
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A:A`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    console.log(`Successfully synced Order #${order.orderNumber} to Google Sheets.`);
  } catch (err) {
    console.error("Failed to sync order to Google Sheets:", err);
  }
}

module.exports = { appendOrderToSheet };
