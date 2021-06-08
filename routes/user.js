const { response } = require("express");
var express = require("express");
const { addProduct } = require("../helpers/product-helpers");
var router = express.Router();
var productHelpers = require("../helpers/product-helpers");
var userHelpers = require("../helpers/user-helpers");

const verifyLogin = (req, res, next) => {
    if (req.session.userLoggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
};

/* GET home page. */
router.get("/", async function (req, res, next) {
    let user = req.session.user;
    let cartCount = null;
    if (user) {
        cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    productHelpers.getAllProducts().then((products) => {
        res.render("user/view-products", { products, user, cartCount });
    });
});

router.get("/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
    } else {
        res.render("user/login", { loginErr: req.session.userLoginErr });
        req.session.userLoginErr = false;
    }
});

router.get("/signup", (req, res) => {
    res.render("user/signup");
});

router.post("/signup", (req, res) => {
    userHelpers.doSignup(req.body).then((response) => {
      req.session.user = response.user;
      req.session.userLoggedIn = true;
        res.redirect("/");
    });
});

router.post("/login", (req, res) => {
    userHelpers.doLogin(req.body).then((response) => {
        if (response.status) {
          req.session.user = response.user;
            req.session.userLoggedIn = true;
            res.redirect("/");
        } else {
            req.session.userLoginErr = "Invalid username and password";
            res.redirect("/login");
        }
    });
});

//logout or clear sessions
router.get("/logout", (req, res) => {
    req.session.user=null
    req.session.userLoggedIn=false
    res.redirect("/");
});
router.get("/cart", verifyLogin, async (req, res) => {
    let products = await userHelpers.getCartProduct(req.session.user._id);
    let totalAmount=0
    if(products.length>0){
      totalAmount = await userHelpers.getTotalAmount(req.session.user._id);
    }
    res.render("user/cart", { products, user: req.session.user, totalAmount });
});
router.get("/add-to-cart/:id", (req, res) => {
    userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
        res.json({ status: true });
    });
});
router.post("/change-product-quantity", (req, res, next) => {
    userHelpers.changeProductQuantity(req.body).then(async (response) => {
        response.totalAmount = await userHelpers.getTotalAmount(req.body.user);

        res.json(response); //ajax response in ajax
    });
});
router.get("/place-order", verifyLogin, async (req, res) => {
    let totalAmount = await userHelpers.getTotalAmount(req.session.user._id);
    res.render("user/placeOrder", { totalAmount, user: req.session.user });
});
router.post("/place-order", async (req, res) => {
    let products = await userHelpers.getCartProductList(req.body.userId);
    let totalAmount = await userHelpers.getTotalAmount(req.body.userId);
    userHelpers.placeOrder(req.body, products, totalAmount).then((orderId) => {
        if (req.body["payment-method"] == "COD") {
            res.json({ codSuccess: true });
        } else {
            userHelpers.generateRazorpay(orderId, totalAmount).then((response) => {
                res.json(response);
            });
        }
    });
});
router.get("/order", (req, res) => {
    res.render("user/order", { user: req.session.user });
});
router.get("/orderListView", async (req, res) => {
    let orders = await userHelpers.getUserOrder(req.session.user._id);
    console.log(orders);
    res.render("user/orderListView", { user: req.session.user, orders });
});
router.get("/view-order-products/:id", async (req, res) => {
    let products = await userHelpers.getOrderProducts(req.params.id);
    console.log(products);
    res.render("user/view-order-products", { user: req.session.user, products });
});
router.post('/verify-payment',(req,res)=>{
  console.log(req.body);
  userHelpers.verifyPayment(req,body).then(()=>{
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
      res.json({status:true})
    })
  }).catch((err)=>{
    console.log(err);
    res.json({status:false,errMsg:''})
  })
})
module.exports = router;
