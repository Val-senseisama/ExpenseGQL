import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session'

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildContext } from 'graphql-passport';

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import {connectDB} from "./db/connectDb.js";
import {configurePassport} from "./passport/passportConfig.js";
import path from 'path';
import job from './cron.js';

configurePassport();

job.start();

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: "sessions"
});

store.on("error", (err) => console.log(err));

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*60*24*7,
        httpOnly:true
    },
    store:store
})
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
});

await server.start();
app.use('/graphql', cors({
    origin: "http://localhost:3000",
    credentials: true
}), express.json(),
expressMiddleware(server, {
    context: async({req,res}) => buildContext({req,res})
}),
);



app.use(express.static(path.join(__dirname, "frontend/dist")))

app.use("*", (req,res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"))

});


await new Promise((resolve) => httpServer.listen({port: 4000}, resolve));
connectDB();


console.log("🚀 Server is up at port 4000");