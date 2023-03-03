var compression = require("compression");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
var handlebar = require("nodemailer-express-handlebars"); // email template
var cookieSession = require("cookie-session");
var cors = require("cors");
const app = express();
var http = require("http").Server(app);
const dotenv = require("dotenv");
const flash = require("connect-flash");

//// cors setup ///
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
//// cors setup ///

//////  session set /////////////////
app.use(
  cookieSession({
    name: "session",
    keys: ["keyboard cat"],
    // Cookie Options
    maxAge: 72 * 60 * 60 * 1000, // 72 hours
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
//////  end session  /////////////////

///////  flash message  /////////
app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});
///////  end flash message  /////////

dotenv.config();
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set("views", __dirname + "/web/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// configure express to use public folder for app front end
app.use("/web-property", express.static(path.join(__dirname, "views/public")));
// configure express to use public folder for app Admin
app.use("/admin-property",express.static(path.join(__dirname, "admin/public")));
// configure upload file path
app.use("/image", express.static(path.join(__dirname, "uploads/images")));
app.use("/document", express.static(path.join(__dirname, "uploads/documents")));
app.use("/logo", express.static(path.join(__dirname, "uploads/logos")));


//=============================== web path =================================//
app.use("/", require("./routes/web"));
//=============================== end web path =============================//

//=============================== Admin web path ============================//
app.use("/admin", require("./routes/admin"));
//=============================== end Admin web path ========================//

//=============================== api path =================================//
app.use("/api", require("./routes/api"));
//=============================== end api path =============================//

//================================= 404 error ==============================//
app.get("*", (req, res) => {
  res.status(404).send("<center><h1>404 Page Not Found!!!</h1></center>");
});
//================================ end 404 error ============================//

////// Database Connection ////////

var dbcon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nettrux",
  multipleStatements: true,
});

// var dbcon = mysql.createConnection({
//     host: 'localhost',
//     user: 'eiplorg_nettrux',
//     password: '4d619SAaa$hy',
//     database: 'eiplorg_nettrux',
//     multipleStatements: true
// });

//   dbcon.connect (err => {
//     if (!err) {
//       console.log ('Database Connection Established');
//     } else {
//       console.log (
//         'Database Connection faild ' + JSON.stringify (err, undefined, 2)
//       );
//     }
//   });

// Database Connection ////

///// Email Configuration Start /////

// var transporter = nodemailer.createTransport ({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   auth: {
//     user: 'noreplyhotspotdatingnow@gmail.com',
//     pass: 'P@ssword77',
//   },
// });

var transporter = nodemailer.createTransport({
    service: "smtp.gmail.com",
    host: "mail.elvirainfotech.org",
    port: 465,
    secure: true,
    auth: {
        user: "noreply@elvirainfotech.org",
        pass: "Seb4YCTQc9w5",
    },
});

// var transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "somnath.elvirainfotech@gmail.com",
//     pass: "jklollbascvqsykv",
//   },
// });

// const handlebarOptions = {
//   viewEngine: {
//     extName: ".hbs",
//     partialsDir: path.join(__dirname, "EmailTemplates"),
//     defaultLayout: false,
//   },
//   viewPath: path.join(__dirname, "EmailTemplates"),
//   extName: ".hbs",
// };

// transporter.use("compile", handlebar(handlebarOptions));

///// Email Configuration End /////

const hostname = "127.0.0.1";
const port = process.env.PORT || 30101;
http.listen(port, hostname, () => {
  console.log(`Server running on port: http://${hostname}:${port}`);
});

module.exports.db = dbcon;
module.exports.transporter = transporter;
