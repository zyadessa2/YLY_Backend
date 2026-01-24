export const successResponse = ({ res, message = "Done", statusCode = 200, data }) => {
    return res.status(statusCode).json({
        statusCode,
        message,
        data
    });
};
//# sourceMappingURL=success.response.js.map