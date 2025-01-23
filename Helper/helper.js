const Helper = {};

Helper.response = (status, message, data = [], res, statusCode) => {
    res.status(statusCode).json({
      status: status,
      message: message,
      data: data,
    });
  };

module.exports = Helper;