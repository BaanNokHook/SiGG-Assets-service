import { Tokens } from "../domains/tokens.model";
import { BaseRepository } from "./base.repository";
import { Document, Model } from "mongoose";
import { injectable } from "inversify";

@injectable()
export class TokensRepository extends BaseRepository<Tokens> {
  constructor(mongooseModel: Model<Document<Tokens>>) {
    super(mongooseModel);
  }
}
