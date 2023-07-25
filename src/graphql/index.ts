import { ApolloServer } from "@apollo/server";
import prismaClient from "../lib/db";
import { User } from "./user";

async function createAppoloGraphqlServer(){
    const gqlServer = new ApolloServer({

        typeDefs: `
        type Query {
            ${User.queries}
        }
        type Mutation {
            ${User.mutation}
        }
        `, //Schema
        resolvers: {
          Query: {
            ...User.resolvers.queries,
          },
          Mutation: {
            ...User.resolvers.mutations
          },
        },
      });
    await gqlServer.start()
    return gqlServer;

}
export default createAppoloGraphqlServer;