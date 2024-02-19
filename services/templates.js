class Templates {
  // async error(req, res){
  //   res.render("components/error", {})
  // }

  async home(req, res) {
    try {
      res.render("index", {});
    } catch (error) {
      res.render("components/error", {error});
    }
  }

  async about(req, res) {
    try {
      res.render("about", {});
    } catch (error) {
      res.render("components/error", {error});
    }
  }

  async contact(req, res) {
    try {
      res.render("contact", {});
    } catch (error) {
      res.render("components/error", {error});
    }
  }

  async login(req, res) {
    if (req.method == "GET") {
      try {
        res.render("login", {});
      } catch (error) {
        res.render("components/error", {error});
      }
    }
  }

  async register(req, res) {
    if (req.method == "GET") {
      try {
        res.render("register", {});
      } catch (error) {
        res.render("components/error", {error});
      }
    }
  }
}

module.exports = Templates;
