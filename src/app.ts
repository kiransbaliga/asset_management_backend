import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import "reflect-metadata";
import cors from "cors";
import express from "express";
import dataSource from "./db/postgres.db";
import loggerMiddleware from "./middleware/logger.middleware";
import { employeeRoute } from "./route/employee.route";
import errorMiddleware from "./middleware/error.middleware";
import rolesRoute from "./route/roles.route";
import departmentRoute from "./route/department.route";
import { requestRoute } from "./route/request.route";
import categoryRoute from "./route/catgeory.route";
import { subcategoryRoute } from "./route/subcategory.route";
import { assetRoute } from "./route/asset.route";
import { historyRoute } from "./route/history.route";

const server = express();
server.use(cors());
server.use(express.json());
server.use(loggerMiddleware);
server.use("/employees", employeeRoute);
server.use("/roles", rolesRoute);
server.use("/department", departmentRoute);
server.use("/requests", requestRoute);
server.use("/category", categoryRoute);
server.use("/subcategory", subcategoryRoute);
server.use("/assets", assetRoute);
server.use("/history", historyRoute);
server.get("/", (req, res) => {
  console.log(req.url);
  res.status(200).send("Hello world typescript");
});
server.use(errorMiddleware);

(async () => {
  await dataSource.initialize();
  server.listen(3000, () => {
    console.log("Server is listening to 3000");
  });
})();
