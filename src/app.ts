import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware';

export default class App {
  public express: Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialiseMiddleware();
    this.initialiseControllers(controllers);
    this.initialiseErrorHandling();
  }

  private initialiseMiddleware() {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use(compression());
  }

  private initialiseControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.express.use(controller.path, controller.router);
    });
  }

  private initialiseErrorHandling() {
    this.express.use(ErrorMiddleware);
  }

  private initialiseDatabaseConnection() {
    const { MONGO_PATH, MONGO_USER, MONGO_PASSWORD } = process.env;
    mongoose
      .connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_PATH}`)
      .then(() => console.log('Successfully connected to dataBase'))
      .catch((e) => console.log('Database connection error: ', e));
  }

  public listen() {
    this.express.listen(this.port, () => {
      console.log(`App is listening on port ${this.port}`);
    });
  }
}
