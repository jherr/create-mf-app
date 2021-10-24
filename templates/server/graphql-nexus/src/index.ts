import { ApolloServer } from "apollo-server";
import { queryType, stringArg, makeSchema } from "nexus";
import * as path from "path";

const Query = queryType({
  definition(t) {
    t.string("hello", {
      args: { name: stringArg() },
      resolve: (parent, { name }) => `Hello ${name || "World"}!`,
    });
  },
});

const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: path.join(__dirname, "/generated/schema.graphql"),
    typegen: path.join(__dirname, "/generated/typings.ts"),
  },
});

const server = new ApolloServer({ schema });

server.listen({ port: {{PORT}} }).then(({ url }) => {
  console.log(`🚀  {{NAME}} ready at ${url}`);
});
