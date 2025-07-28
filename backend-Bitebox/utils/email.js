const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: config.emailUser,
        pass: config.emailPassword,
    },
});

exports.sendVerificationEmail = async (to, code) => {
    try {
        const mailOptions = {
            from: `"Bitebox" <${config.emailUser}>`,
            to,
            subject: 'Your Email Verification Code',
            text: `Your verification code is: ${code}`,
            html: `<p>Your verification code is: <b>${code}</b></p>`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent successfully to: ${to}`);
    } catch (error) {
        console.error('Email sending error:', error.message);
        throw error;
    }
};

exports.sendOrderConfirmationEmail = async (to, order) => {
    try {
        const mailOptions = {
            from: `"Bitebox" <${config.emailUser}>`,
            to,
            subject: `Order Confirmation - ${order.orderId}`,
            text: `Thank you for your order! Your order ID is: ${order.orderId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Order Confirmation</h2>
                    <p>Thank you for your order! Here are your order details:</p>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3>Order Information</h3>
                        <p><strong>Order ID:</strong> ${order.orderId}</p>
                        <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Total Amount:</strong> $${order.total}</p>
                        <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
                        <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${order.customerInfo.firstName} ${order.customerInfo.lastName}</p>
                        <p><strong>Email:</strong> ${order.customerInfo.email}</p>
                        <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
                        <p><strong>Address:</strong> ${order.customerInfo.address}, ${order.customerInfo.city}</p>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h3>Order Items</h3>
                        ${order.items.map(item => `
                            <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
                                <p><strong>${item.title}</strong></p>
                                <p>Servings: ${item.servings}</p>
                                <p>Price: $${item.price}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <p>We'll notify you when your order is ready for delivery.</p>
                    <p>Thank you for choosing Bitebox!</p>
                </div>
            `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Order confirmation email sent successfully to: ${to}`);
    } catch (error) {
        console.error('Order confirmation email sending error:', error.message);
        throw error;
    }
};