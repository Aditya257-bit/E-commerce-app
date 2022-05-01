const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+'-'+file.originalname);
    }
});

const upload = multer({ storage });

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { create, read, remove, update, list, listCategory, photo, productById, listBySearch} = require("../controllers/product");

router.get("/product/:productId", read);
router.post("/product/create/:userId", upload.single('photo'), requireSignin, isAuth, isAdmin, create);
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/product/:productId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/products", list);
router.get("/products/categories", listCategory);
router.post("/products/by/search", listBySearch);
router.get("/product/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);

module.exports = router;