import { MongoDbConnector } from "../connectors/mongodb.connector";
import { ErrorExtractor } from "../helpers/error-extractor.helper";
import {
  Container as InversifyContainer,
  interfaces,
  ContainerModule,
} from "inversify";
import { AppLogger } from "../loggers/app.logger";
import { AuthLogger } from "../loggers/auth.logger";
import { RequestLogger } from "../loggers/request.logger";
import { ResponseLogger } from "../loggers/response.logger";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ErrorMiddleware } from "../middlewares/error.middleware";
import { RequestLoggerMiddleware } from "../middlewares/request-logger.middleware";
import { ResponseLoggerMiddleware } from "../middlewares/response-logger.middleware";
import { SecretsProvider } from "../services/token/secrets.provider";
import { JwtWrapper } from "../wrappers/jwt.wrapper";

import { BaseController } from "../controllers/base.controller";
import { AssetsController } from "../controllers/assets.controller";

import { App } from "../app";
import { AppConfig } from "./app.config";
import { SwaggerConfig } from "./swagger.config";

import { TokensModel } from "../domains/tokens.model";
import { TokensRepository } from "../repositories/tokens.repository";

import { AddTokenHandler } from "../handlers/add-token.handler";
import { UpdateTokenHandler } from "../handlers/update-token.handler";
import { UpdateTokenStatusHandler } from "../handlers/update-token-status.handler";
import { GetTokens } from "../handlers/get-tokens.handler";
import { TokenService } from "../services/token/token.service";

export class Container {
  private _container: InversifyContainer = new InversifyContainer();

  protected get container(): InversifyContainer {
    return this._container;
  }

  constructor() {
    this.register();
  }

  public getApp(): App {
    return this.container.get(App);
  }

  private register(): void {
    this._container.load(this.getRepositoriesModule());
    this._container.load(this.getLoggersModule());
    this._container.load(this.getMiddlewaresModule());
    this._container.load(this.getGeneralModule());
    this._container.load(this.getControllersModule());
    this._container.load(this.getHelpersModule());
    this._container.load(this.getWrappersModule());

    this._container.load(this.AddTokenHandlerModule());
    this._container.load(this.UpdateTokenHandlerModule());
    this._container.load(this.UpdateTokenStatusHandlerModule());
    this._container.load(this.GetTokenHandlerModule());

    this._container.load(this.getServicesModule());

    this._container.bind<App>(App).toSelf();
  }

  private getRepositoriesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<TokensRepository>(TokensRepository).toConstantValue(
        new TokensRepository(TokensModel)
      );
    });
  }

  private getLoggersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AppLogger>(AppLogger).toSelf();
      bind<RequestLogger>(RequestLogger).toSelf();
      bind<ResponseLogger>(ResponseLogger).toSelf();
      bind<AuthLogger>(AuthLogger).toSelf();
    });
  }

  private getMiddlewaresModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<RequestLoggerMiddleware>(RequestLoggerMiddleware).toSelf();
      bind<ErrorMiddleware>(ErrorMiddleware).toSelf();
      bind<ResponseLoggerMiddleware>(ResponseLoggerMiddleware).toSelf();
      bind<AuthMiddleware>(AuthMiddleware).toSelf();
    });
  }

  private getGeneralModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AppConfig>(AppConfig).toSelf().inSingletonScope();
      bind<SwaggerConfig>(SwaggerConfig).toSelf();
      bind<MongoDbConnector>(MongoDbConnector).toSelf();
    });
  }

  private getControllersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<BaseController>(BaseController).to(AssetsController);
    });
  }

  private getHelpersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<ErrorExtractor>(ErrorExtractor).toSelf();
      bind<SecretsProvider>(SecretsProvider).toSelf().inSingletonScope();
    });
  }

  private getWrappersModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<JwtWrapper>(JwtWrapper).toSelf();
    });
  }

  //---------
  private AddTokenHandlerModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<AddTokenHandler>(AddTokenHandler).toSelf();
    });
  }

  private UpdateTokenHandlerModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<UpdateTokenHandler>(UpdateTokenHandler).toSelf();
    });
  }

  private UpdateTokenStatusHandlerModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<UpdateTokenStatusHandler>(UpdateTokenStatusHandler).toSelf();
    });
  }

  private GetTokenHandlerModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<GetTokens>(GetTokens).toSelf();
    });
  }

  //---------
  private getServicesModule(): ContainerModule {
    return new ContainerModule((bind: interfaces.Bind) => {
      bind<TokenService>(TokenService).toSelf();
    });
  }
}
