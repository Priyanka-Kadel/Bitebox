const Order = require('../models/orderModel');
const Cart = require('../models/cartModel');

exports.createOrder = async (req, res) => {
  try {
    console.log('=== ORDER CREATION START ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('User object:', req.user);

    if (!req.user || !req.user.id) {
      console.log('No authenticated user found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { items, customerInfo, total, paymentMethod } = req.body;

 
    if (!items || !customerInfo || !total || !paymentMethod) {
      console.log('Missing required fields:', { 
        items: !!items, 
        customerInfo: !!customerInfo, 
        total: !!total, 
        paymentMethod: !!paymentMethod 
      });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: items, customerInfo, total, paymentMethod'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.log('Invalid items array:', items);
      return res.status(400).json({
        success: false,
        message: 'Items must be a non-empty array'
      });
    }

    const requiredCustomerFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    for (const field of requiredCustomerFields) {
      if (!customerInfo[field]) {
        console.log('Missing customer field:', field);
        return res.status(400).json({
          success: false,
          message: `Missing required customer field: ${field}`
        });
      }
    }

    console.log('Creating order for user:', req.user.id);

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderId = `ORD-${timestamp}-${randomStr}`;
    const orderNumber = `ORD-${timestamp}-${randomStr}`;

    console.log('Generated orderId:', orderId);
    console.log('Generated orderNumber:', orderNumber);

    const orderData = {
      userId: req.user.id,
      orderId: orderId,
      orderNumber: orderNumber,
      items: items,
      customerInfo: customerInfo,
      total: total,
      paymentMethod: paymentMethod,
      status: 'pending'
    };

    console.log('Order data to save:', orderData);

    const order = new Order(orderData);

    console.log('Saving order...');
    await order.save();
    console.log('Order saved successfully:', order.orderId);

    res.status(201).json({
      success: true,
      orderId: order.orderId,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Error creating order:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({
        success: false,
        message: 'Order validation failed',
        errors: validationErrors
      });
    }
    
    if (error.code === 11000) {
      console.error('Duplicate key error:', error.keyValue);
      return res.status(400).json({
        success: false,
        message: 'Order creation failed due to duplicate key. Please try again.',
        error: 'Duplicate order number'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: {
        id: order._id,
        orderId: order.orderId,
        status: order.status,
        paymentMethod: order.paymentMethod,
        total: order.total,
        customerInfo: order.customerInfo,
        items: order.items,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
        deliveredAt: order.deliveredAt
      }
    });

  } catch (error) {
    console.error('Error getting order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving order status',
      error: error.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving orders',
      error: error.message
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: order
    });

  } catch (error) {
    console.error('Error getting order by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving order',
      error: error.message
    });
  }
};


exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id,
      userId: req.user.id 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled. Only pending orders can be cancelled.'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};


exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving orders',
      error: error.message
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'paid', 'failed', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, paid, failed, delivered, cancelled'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    
    if (status === 'paid' && !order.paidAt) {
      order.paidAt = new Date();
    } else if (status === 'delivered' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
}; 