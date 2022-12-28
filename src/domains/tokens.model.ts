import { model, Document, Schema } from "mongoose";
import { BaseModel } from "./base.model";

const TokenDetailSchema = new Schema({
  tokenName: { type: Schema.Types.String, required: true },
  tokenAbb: { type: Schema.Types.String, required: true },
  tokenAddress: { type: Schema.Types.String, required: true },
  tokenSymbol: { type: Schema.Types.String, required: true },
  tokenStatus: { type: Schema.Types.Boolean, required: true },
});

export class Tokens extends BaseModel {
  tokenName!: string;
  tokenAbb!: string;
  tokenAddress!: string;
  tokenSymbol!: string;
  tokenStatus!: boolean;

  constructor(init?: Partial<Tokens>) {
    super(init);
    Object.assign(this, init);
  }
}
export const TokensModel = model<Document<Tokens>>("tokens", TokenDetailSchema);
