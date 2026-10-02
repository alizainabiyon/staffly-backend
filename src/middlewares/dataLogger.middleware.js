exports.dataLogger = (req, res, next) => {
  const { body, query, originalUrl } = req;
  console.log('/////////////////////////////////////////////////////');
  console.log('REQUEST :::: ', {
    endPoint: originalUrl,
    query,
    body: JSON.stringify(body),
  });
  next();
};
