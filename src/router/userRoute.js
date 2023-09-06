const userRoute = require("express").Router();
const userController = require("../controller/userController");
const { adminMiddleware } = require("../middleware/APIMiddleware");

userRoute.post("/", adminMiddleware, userController.signUp);

userRoute.post("/signIn", userController.signIn);

userRoute.post("/signOut", adminMiddleware, userController.signOut);

userRoute.delete("/delete/:_id", adminMiddleware, userController.delete);

userRoute.patch("/update/:_id", adminMiddleware, userController.update);

userRoute.get("/get/:_id", adminMiddleware, userController.getById);

userRoute.get("/get", adminMiddleware, userController.get);


module.exports = userRoute;


// "email":"radhe@gmail.com",
//   "password":"shyam2244"
