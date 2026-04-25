export const errorHandler = (err, req, res, next) => {
    // Log the error to the console for debugging
    console.error('Server Error:', err.message);

    // Determine the status code (default to 500 if unknown)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Send uniform JSON response for all error cases
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // Only show stack trace in development, hide it in production for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};
