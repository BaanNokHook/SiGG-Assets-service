import { injectable } from "inversify";
import { Response } from "express";
import { TokensRepository } from "../repositories/tokens.repository";
import { StatusHelper } from "../helpers/status.helper";
import { IGetHandler } from "../interfaces/command.handler";

@injectable()
export class GetTokens implements IGetHandler {
  private readonly tokensRepository: TokensRepository;

  constructor(_tokensRepository: TokensRepository) {
    this.tokensRepository = _tokensRepository;
  }

  public async Handler(res: Response) {
    const tokenList = await this.tokensRepository.getAll();
    res.status(StatusHelper.status200OK).send({
      resultCode: "20000",
      resultDescription: "Success",
      data: {
        tokenList,
      },
    });
  }
}
