import { UpdateTokenStatusCommand } from "../commands/token.commans";
import { BodyRequest } from "../commands/BodyRequest";
import { injectable } from "inversify";
import { TokensRepository } from "../repositories/tokens.repository";

import { ICommandHandler } from "../interfaces/command.handler";
import { Response } from "express";
import { StatusHelper } from "../helpers/status.helper";

@injectable()
export class UpdateTokenStatusHandler
  implements ICommandHandler<UpdateTokenStatusCommand>
{
  private readonly tokensRepository: TokensRepository;

  constructor(_tokensRepository: TokensRepository) {
    this.tokensRepository = _tokensRepository;
  }

  public async Handler(
    req: BodyRequest<UpdateTokenStatusCommand>,
    res: Response
  ) {
    const token = req.body;

    if (
      await this.tokensRepository.exists({
        _id: token._id,
      })
    ) {
      await this.tokensRepository.updateOne(
        { _id: token._id },
        {
          tokenStatus: token.tokenStatus,
        }
      );
      res.status(StatusHelper.status200OK).send({
        resultCode: "20000",
        resultDescription: "Success",
      });
    } else {
      throw StatusHelper.error404NotFound;
    }
  }
}
