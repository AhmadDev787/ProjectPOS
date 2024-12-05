const express = require('express');
const app = express();
const router = express.Router();
 router.post('/',(req,res)=>{
    const { products, totalPrice, payment, returnAmount, paymentMode, cashierName } = req.body;
   // Create a new PDF document
   let htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .invoice-container { width: 80%; margin: auto; border: 1px solid #ddd; padding: 20px; }
          .header { text-align: center; }
          .header h1 { margin: 0; font-size: 30px; }
          .header p { margin: 0; font-size: 14px; }
          .invoice-title { text-align: center; font-size: 24px; margin-top: 20px; }
          .cashier-name { text-align: center; font-size: 16px; }
          .table { width: 100%; margin-top: 20px; border-collapse: collapse; }
          .table th, .table td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; }
          .table th { background-color: #f4f4f4; }
          .table td { text-align: right; }
          .table td:first-child { text-align: left; }
          .total { text-align: right; font-size: 18px; margin-top: 20px; }
          .footer { text-align: center; font-size: 12px; margin-top: 30px; color: #888; }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <h1>BizOps Store</h1>
            <p>123, Business Street, City XYZ</p>
            <p>Phone: +123 456 7890</p>
          </div>
          <div class="invoice-title">INVOICE</div>
          <div class="cashier-name">Cashier: ${cashierName}</div>
          
          <table class="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Discount (%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(product => `
                <tr>
                  <td>${product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>${product.quantity}</td>
                  <td>${product.discount ? product.discount.toFixed(2) : '0'}</td>
                  <td>${product.discountedPrice.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Total: ${totalPrice.toFixed(2)} Rs.</p>
            <p>Payment: ${payment.toFixed(2)} Rs.</p>
            <p>Return: ${returnAmount.toFixed(2)} Rs.</p>
            <p>Payment Method: ${paymentMode} .</p>
          </div>

          <div class="footer">
            <p>BizOps Software Developed by Mahar Ahmad | Phone: +123 456 7890</p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send the HTML response
  res.send(htmlContent);
 })
 module.exports = router;