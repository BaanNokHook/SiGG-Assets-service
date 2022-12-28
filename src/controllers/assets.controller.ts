import { injectable } from "inversify";
import { BaseController } from "./base.controller";
import { Response } from "express";
import { BodyRequest } from "../commands/BodyRequest";

import { TokensRepository } from "../repositories/tokens.repository";

import { AddTokenHandler } from "../handlers/add-token.handler";
import { UpdateTokenHandler } from "../handlers/update-token.handler";
import { UpdateTokenStatusHandler } from "../handlers/update-token-status.handler";
import { GetTokens } from "../handlers/get-tokens.handler";

import {
  CreateTokenCommand,
  UpdateTokenCommand,
  UpdateTokenStatusCommand,
} from "commands/token.commans";

@injectable()
export class AssetsController extends BaseController {
  protected readonly tokensRepository: TokensRepository;

  private readonly addTokenHandler: AddTokenHandler;
  private readonly updateTokenHandler: UpdateTokenHandler;
  private readonly updateTokenStatusHandler: UpdateTokenStatusHandler;
  private readonly getToken: GetTokens;

  constructor(
    tokensRepository: TokensRepository,
    addTokenHandler: AddTokenHandler,
    updateTokenHandler: UpdateTokenHandler,
    updateTokenStatusHandler: UpdateTokenStatusHandler,
    getToken: GetTokens
  ) {
    super("/assets", false);
    this.tokensRepository = tokensRepository;
    this.addTokenHandler = addTokenHandler;
    this.updateTokenHandler = updateTokenHandler;
    this.updateTokenStatusHandler = updateTokenStatusHandler;
    this.getToken = getToken;
  }

  public initializeRoutes(): void {
    this.router.get(`${this.path}/token`, this.getTokenList.bind(this));
    this.router.post(`${this.path}/token/add`, this.addToken.bind(this));
    this.router.post(`${this.path}/token/update`, this.updateToken.bind(this));
    this.router.post(
      `${this.path}/token/update/status`,
      this.updateTokenStatus.bind(this)
    );
  }

  private async getTokenList(_, res: Response) {
    await this.getToken.Handler(res);
  }

  private async addToken(req: BodyRequest<CreateTokenCommand>, res: Response) {
    await this.addTokenHandler.Handler(req, res);
  }

  private async updateToken(
    req: BodyRequest<UpdateTokenCommand>,
    res: Response
  ) {
    await this.updateTokenHandler.Handler(req, res);
  }

  private async updateTokenStatus(
    req: BodyRequest<UpdateTokenStatusCommand>,
    res: Response
  ) {
    await this.updateTokenStatusHandler.Handler(req, res);
  }
}
