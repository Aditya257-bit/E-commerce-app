require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

//env variables
const port = process.env.PORT || 8000;
const DB =  process.env.MONGODB_URL;

//database connection
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connection Successful");
}).catch((error) => {
    console.log(error);
})

//middlewares
app.use(morgan('dev'));
// app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cors());

//routes middlewares
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});