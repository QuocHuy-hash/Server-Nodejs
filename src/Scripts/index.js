const express = require("express");
const app = express();
var exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
//model
const Products = require("../model/Products");
const Message = require('../model/chat.model.js')
//router
const loginRouter = require("../route/loginRouter.js");
const registerRoute = require("../route/registerRouter.js");
const listUserRoute = require("../route/listUser.js");
const listProductRoute = require("../route/getProducts.js");
const addProducts = require("../route/addProducts.js");
const information = require("../route/information");
const detailUser = require("../route/detailUser");
const detailProduct = require("../route/detailProduct");
const chat = require("../route/chat.js")
// socket
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://huy343536:Hoangquochuy1@cluster0.rvoqynt.mongodb.net/dataProducts?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to MongoDB");

});

app.engine('.hbs', exphbs.engine());
app.set('view engine', '.hbs');
app.set("views", "./src/views");
app.use(express.static('css'));
app.use(express.static('image'));

//data : thoong tin người dùng , thông tin tài khoản , danh mục sản phẩm , thông tin sản phẩm


app.use(flash());
app.use(session({
    secret: 'login',
    resave: false,
    saveUninitialized: true
}));

//   app.get("/home", async (req, res, next) => {
//     var data = req.session.data;
//         const products = await Products.find({});
//         data = products.map(product => {
//             return {
//                 ...product.toJSON(),
//                 image: {
//                     data: `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`,
//                     contentType: product.image.contentType
//                 }
//             };
//         });
//     var user = req.session.user ? req.session.user.userName : "";

//     res.render("home", {
//         style: "styles.css",
//         data: data,
//         user: user
//     });
// });
app.get("/home", async (req, res, next) => {
    try {
        var data = req.session.data;
        // const products = await Products.find({});
        //  data = products.map(product => {
        //     if (product.image && product.image.contentType && product.image.data) {
        //         return {
        //             ...product.toJSON(),
        //             image: {
        //                 data: `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`,
        //                 contentType: product.image.contentType
        //             }
        //         };
        //     } else {
        //         return {
        //             ...product.toJSON(),
        //             image: {
        //                 data: data, 
        //                 contentType: product.image.contentType
        //             }
        //         };
        //     }
        // });
        const user = req.session.user || {};

        console.log("user ", user);
        res.render("home", {
            style: "styles.css",
            data: data,
            user: user
        });
    } catch (error) {
        console.error("Error in /home route:", error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/home1", async (req, res) => {
    const products = await Products.find({});
    var data = products.map(products => {
        return {
            ...products.toJSON(),
            image: {
                data: `data:${products.image.contentType};base64,${products.image.data.toString('base64')}`,
                contentType: products.image.contentType
            }
        };
    });
    res.json(data);

});

app.use("/", loginRouter);
app.use("/", registerRoute);
app.use("/", listUserRoute);
app.use("/", listProductRoute);
app.use("/", addProducts);
app.use("/", information);
app.use("/", detailUser);
app.use("/", detailProduct);
app.use("/", chat);

server.listen(5000, () => {
    console.log('server is runing socket io : http://localhost:5000');


// router.get("/products/addProducts:id" , addProducts); 
app.listen(5000, () => {
    console.log('server is runing : http://localhost:5000/home');


});
io.on('connection', (socket) => {
    console.log('User connected to socket');
  

    socket.on('chat message', async(msg) => {

      try {
        
        await Message.insertMany(msg);
        console.log('Tin nhắn đã được lưu vào MongoDB:', msg);
      } catch (error) {
        console.error('Lỗi khi lưu tin nhắn vào MongoDB:', error);
      }

      io.emit('chat message', msg);
    });
  

    socket.on('disconnect', () => {
      console.log('User disconnected from socket');
    });
  });
