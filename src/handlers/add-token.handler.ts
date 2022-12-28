import { CreateTokenCommand } from "../commands/token.commans";
import { BodyRequest } from "../commands/BodyRequest";
import { injectable } from "inversify";
import { TokensRepository } from "../repositories/tokens.repository";

import { ICommandHandler } from "../interfaces/command.handler";
import { Response } from "express";
import { Tokens } from "../domains/tokens.model";
import { StatusHelper } from "../helpers/status.helper";

@injectable()
export class AddTokenHandler implements ICommandHandler<CreateTokenCommand> {
  private readonly tokensRepository: TokensRepository;

  constructor(_tokensRepository: TokensRepository) {
    this.tokensRepository = _tokensRepository;
  }

  public async Handler(req: BodyRequest<CreateTokenCommand>, res: Response) {
    const token = req.body;

    if (
      !(await this.tokensRepository.exists({
        tokenAddress: token.tokenAddress,
      }))
    ) {
      const newToken = new Tokens({ ...token });
      await this.tokensRepository.create(newToken);
      res.status(StatusHelper.status201Created).send({
        resultCode: "20100",
        resultDescription: "Success",
      });
    } else {
      throw StatusHelper.error409Conflict;
    }
  }
}
