import { createServer } from "http";
import express from "express";
import { execute, subscribe } from "graphql";
import { ApolloServer, gql } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

(async () => {
  const PORT = {{PORT}};
  const pubsub = new PubSub();
  const app = express();
  const httpServer = createServer(app);

  // Schema definition
  const typeDefs = gql`
    type Query {
      currentNumber: Int
    }

    type Subscription {
      numberIncremented: Int
    }
  `;

  // Resolver map
  const resolvers = {
    Query: {
      currentNumber() {
        return currentNumber;
      },
    },
    Subscription: {
      numberIncremented: {
        subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"]),
      },
    },
  };

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
  });
  await server.start();
  server.applyMiddleware({ app });

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath }
  );

  httpServer.listen(PORT, () => {
    console.log(
      `🚀 {{NAME}} Query endpoint ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 {{NAME}} Subscription endpoint ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });

  let currentNumber = 0;
  function incrementNumber() {
    currentNumber++;
    pubsub.publish("NUMBER_INCREMENTED", { numberIncremented: currentNumber });
    setTimeout(incrementNumber, 1000);
  }
  // Start incrementing
  incrementNumber();
})();
