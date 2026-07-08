const { z } = require("zod");
const prisma = require("./src/lib/prisma.client");

async function test() {
  try {
    const product = await prisma.product.findFirst();
    if (!product) return console.log("No product");

    const orderNumber = "TEST-" + Date.now();
    const subtotal = Number(product.pricePerKg) * 1;
    const DELIVERY_FEE = 5.0;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: "Test",
        customerEmail: "test@example.com",
        paymentMethod: "COD",
        paymentStatus: "UNPAID",
        deliveryLine1: "123 Test",
        deliveryCity: "City",
        contactPhone: "1234",
        subtotal,
        deliveryFee: DELIVERY_FEE,
        total: subtotal + DELIVERY_FEE,
        requestedDeliveryDate: undefined,
        items: {
          create: [{
            productId: product.id,
            productName: product.name,
            unitPrice: product.pricePerKg,
            quantityKg: 1,
            lineTotal: subtotal
          }]
        }
      }
    });
    console.log("Success:", order);
  } catch (err) {
    console.error("Prisma Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
