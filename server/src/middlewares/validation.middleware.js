export const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({
        status: 'VALIDATION_ERROR',
        message: 'Invalid payload structure',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    return res.status(400).json({ status: 'ERROR', message: error.message });
  }
};

