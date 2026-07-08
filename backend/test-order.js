async function testPlaceOrder() {
  try {
    const productsRes = await fetch('http://localhost:4000/api/products');
    const products = await productsRes.json();
    if (!products.length) {
      console.log('No products');
      return;
    }
    const product = products[0];

    const res = await fetch('http://localhost:4000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: "Test Name",
        customerEmail: "test@example.com",
        deliveryLine1: "123 Test St",
        contactPhone: "1234567890",
        paymentMethod: "COD",
        requestedDeliveryDate: "2026-07-08T15:30",
        items: [{ productId: product.id, quantityKg: 1 }]
      })
    });

    const data = await res.json();
    if (res.ok) {
      console.log('Success:', data);
    } else {
      console.log('Error Data:', data);
      console.log('Error Status:', res.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPlaceOrder();
