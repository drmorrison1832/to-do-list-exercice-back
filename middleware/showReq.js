function showReq(req, res, then) {
  console.warn("🔹 ShowReq");

  console.warn(req.method + ":", req.url);

  req.headers.authorization &&
    console.log(
      " headers.authorization (token):",
      req.headers.authorization.replace("Bearer ", "")
    );

  req.params && console.log(" Params:", req.params);
  req.query && console.log(" Query:", req.query);
  req.body && console.log(" Body:", req.body);
  req.files && console.log(" Files:", req.files);

  then();
}

module.exports = showReq;
