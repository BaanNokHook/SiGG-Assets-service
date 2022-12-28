import { injectable, inject } from "inversify";
import { AppConfig } from "../../configurations/app.config";
import { SecretsProvider } from "./secrets.provider";
import { JwtWrapper } from "../../wrappers/jwt.wrapper";
import { TokenData } from "./token";
import { AuthLogger } from "../../loggers/auth.logger";

@injectable()
export class TokenService {
  @inject(AppConfig) private readonly appConfig: AppConfig;
  @inject(SecretsProvider) private readonly secretsProvider: SecretsProvider;
  @inject(AuthLogger) private readonly authLogger: AuthLogger;
  @inject(JwtWrapper) private readonly jwt: JwtWrapper;

  public verify(token: string): TokenData {
    try {
      const options = {
        algorithms: ["RS256"],
      };
      const tokenData = this.jwt.verify(
        token,
        this.secretsProvider.publicKey,
        options
      ) as TokenData;
      return tokenData;
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        this.authLogger.warn(err.message);
      }
      return null;
    }
  }
}
