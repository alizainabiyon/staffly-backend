// @Generic Response Send Function
exports.successResponse = ({ res, code, data, message }) => {
  console.log(`Success Response ::: ${message}`);
  return res.status(code).json({
    status: {
      code,
      success: true,
    },

    response: {
      message,
      data: data || null,
    },
  });
};

exports.returnSuccess = (success) => {
  const { message, data } = success;
  console.log(message);
  return {
    success: true,
    message,
    data,
  };
};
