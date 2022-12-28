export class CreateTokenCommand {
  tokenName!: string;
  tokenAbb!: string;
  tokenAddress!: string;
  tokenSymbol!: string;
  tokenStatus!: boolean;
}

export class UpdateTokenCommand extends CreateTokenCommand {
  _id!: string;
}
export class UpdateTokenStatusCommand {
  _id!: string;
  tokenStatus!: boolean;
}
