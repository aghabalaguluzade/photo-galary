const getIndexPage = (req,res) => {
     res.render("index", {
          link : "index"
     });
};

const getAboutPage = (req,res) => {
     res.render("about", {
          link : "about"
     });
};

const userRegister = (req,res) => {
     res.render("register",{
          link : "register"
     });
};

const userLogin = (req,res) => {
     res.render("login", {
          link : "login"
     });
}

export {
     getIndexPage,
     getAboutPage,
     userRegister,
     userLogin
};