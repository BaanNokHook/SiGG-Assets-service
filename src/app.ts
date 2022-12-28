import { injectable, inject, multiInject } from "inversify";
import { Server } from "http";
import { AddressInfo } from "net";
import { jsonIgnoreReplacer } from "json-ignore";

import { AppConfig } from "./configurations/app.config";
import { MongoDbConnector } from "./connectors/mongodb.connector";
import { SwaggerConfig } from "./configurations/swagger.config";
import { AppLogger } from "./loggers/app.logger";
import { RequestLoggerMiddleware } from "./middlewares/request-logger.middleware";
import { ResponseLoggerMiddleware } from "./middlewares/response-logger.middleware";
import { BaseController } from "./controllers/base.controller";
import { ErrorMiddleware } from "./middlewares/error.middleware";

import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

@injectable()
export class App {
  private app = express();
  private isInitialized: boolean = false;
  private server: Server;

  @inject(AppConfig) private readonly appConfig: AppConfig;
  @inject(AppLogger) private readonly appLogger: AppLogger;
  @multiInject(BaseController) private controllers: BaseController[];
  @inject(MongoDbConnector) private readonly dbConnector: MongoDbConnector;
  @inject(SwaggerConfig) private readonly swaggerConfig: SwaggerConfig;
  @inject(ErrorMiddleware) private readonly errorMiddleware: ErrorMiddleware;

  @inject(RequestLoggerMiddleware)
  private readonly requestLoggerMiddleware: RequestLoggerMiddleware;
  @inject(ResponseLoggerMiddleware)
  private readonly responseLoggerMiddleware: ResponseLoggerMiddleware;

  public initialize(process: NodeJS.Process): void {
    this.appConfig.initialize(process.env);

    this.dbConnector.connect();
    this.setExpressSettings();
    this.initializePreMiddlewares();
    this.initializeControllers();
    this.initializePostMiddlewares();

    this.isInitialized = true;
  }

  public listen() {
    if (!this.isInitialized) {
      throw new Error("Call initialize() before.");
    }

    this.server = this.app.listen(this.appConfig.applicationPort, () => {
      const addressInfo = this.server.address() as AddressInfo;
      this.appConfig.setApplicationHost(addressInfo.address);

      this.swaggerConfig.initialize(this.app);

      this.appLogger.info(
        `Listening at 'http://${this.appConfig.applicationHost}:${this.appConfig.applicationPort}'.`
      );
    });
  }

  public shutdown() {
    this.server.close(() => {
      this.appLogger.info("Shutting Down...");
      this.dbConnector.disconnect();
      this.appLogger.info("MongoDb connection closed.");
    });
  }

  private setExpressSettings(): void {
    this.app.set("json replacer", jsonIgnoreReplacer);
  }

  private initializePreMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());

    this.app.use(
      this.requestLoggerMiddleware.handle.bind(this.requestLoggerMiddleware)
    );
    this.app.use(
      this.responseLoggerMiddleware.handle.bind(this.responseLoggerMiddleware)
    );
  }

  private initializeControllers(): void {
    this.app.get("/", (req, res) => {
      res.redirect("/swagger");
    });

    this.controllers.forEach((controller: BaseController) => {
      controller.initializeRoutes();
      this.app.use(this.appConfig.apiPath, controller.router);
      this.appLogger.debug(
        `Registered '${this.appConfig.apiPath}${controller.path}'.`
      );
    });
  }

  private initializePostMiddlewares(): void {
    this.app.use(this.errorMiddleware.handle.bind(this.errorMiddleware));
  }
}
