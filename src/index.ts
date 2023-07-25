import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import prismaClient from "./lib/db";
import createAppoloGraphqlServer from "./graphql";
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());
  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });
  app.use("/graphql", expressMiddleware(await createAppoloGraphqlServer()));

  app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
}
init();
