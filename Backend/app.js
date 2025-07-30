require("dotenv").config();
const express = require("express");
const sanitize = require("sanitize");
const cors = require("cors");
const path = require("path");
const loginRoutes = require('./routes/login.routes');
const app = express();
app.use('/api', loginRoutes);

// Import route modules
const authRoutes = require("./routes/auth.routes");
const employeeRoutes = require("./routes/employee.routes");
const customerRoutes = require("./routes/customer.routes");
const vehicleRoutes = require("./routes/vehicle.routes");
const orderRoutes = require("./routes/order.routes");
const serviceRoutes = require("./routes/service.routes");

// Environment variables
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware Configuration

// CORS configuration
app.use(cors({ 
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization middleware
app.use(sanitize.middleware);

// Static files middleware (uploads folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Abe Garage API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Mount API routes with prefixes
app.use('/api/auth', authRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/service', serviceRoutes);

// 404 handler for undefined routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);

    let error = {
        success: false,
        message: err.message || 'Internal Server Error',
        status: err.status || 500
    };

    if (err.name === 'ValidationError') {
        error.status = 400;
        error.message = 'Validation Error';
        error.details = err.details;
    } else if (err.name === 'UnauthorizedError') {
        error.status = 401;
        error.message = 'Unauthorized Access';
    } else if (err.name === 'CastError') {
        error.status = 400;
        error.message = 'Invalid ID format';
    }

    if (process.env.NODE_ENV === 'production' && error.status === 500) {
        error.message = 'Internal Server Error';
    }

    res.status(error.status).json(error);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    process.exit(1);
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

module.exports = app;
