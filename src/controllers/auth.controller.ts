import { AppConfig } from "../configurations/app.config";
import { injectable, inject } from "inversify";
import { BaseController } from "./base.controller";

@injectable()
export class AuthController extends BaseController {
  @inject(AppConfig) private readonly appConfig: AppConfig;

  constructor() {
    super("/auth", false);
  }

  public initializeRoutes(): void {}
}
