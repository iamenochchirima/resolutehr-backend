import { Router } from "express";
import auth from "./auth";
import users from "./users";
// import apis from "./externals";
// import utils from "./utils";

const router = Router();

export default (): Router => {
  auth(router);
  users(router);
  // apis(router);
  // utils(router);
  return router;
};
