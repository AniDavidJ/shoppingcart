var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let products=[
    {
      name:"Apple iPhone 12",
      category:"Facetime 128GB",
      description:"Powerful chipset accounts for seamless multitasking",
      image:"https://z.nooncdn.com/products/tr:n-t_240/v1605988778/N41247239A_1.jpg"
    },
    {
      name:"Realme 7 Pro Dual Sim",
      category:"Mirror Blue 8GB RAM",
      description:"Furnished with a generously sized display for enhanced viewing",
      image:"https://z.nooncdn.com/products/tr:n-t_240/v1605988803/N40832026A_1.jpg"
    },
    {
      name:"Xiaomi Poco M3 Dual",
      category:"SIM Power Black",
      description:"lightweight body fits easily in the palm of your hand",
      image:"https://z.nooncdn.com/products/tr:n-t_240/v1608182656/N43078463A_1.jpg"
    },
    {
      name:"IPHONE 11",
      category:"Moblie",
      description:"High capacity battery powers the device for prolonged hours on a single charge",
      image:"https://z.nooncdn.com/products/tr:n-t_240/v1613560699/N44422144A_1.jpg"
    }
  ]

  res.render('index', { products,admin:false });
});

module.exports = router;
