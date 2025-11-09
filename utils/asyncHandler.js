// const asyncHandler = () => {}
// basically made a wrapper code which can be directy imported to another files and used to handle async errors in express routes

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export default asyncHandler;
