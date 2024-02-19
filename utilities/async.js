exports.asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      res.render("../views/components/error.ejs", {error:{
        message: "Something happend, we are unable to process your request at this moment. Kindly click on the button below to restart the process.",
        cta: "Go back",
        link: "/login"
      }});
      next(err);
    }
  };
};
