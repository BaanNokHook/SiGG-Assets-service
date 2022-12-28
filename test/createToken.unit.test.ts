import "reflect-metadata";
import sinon from "sinon";
import chai from "chai";

import { TokensRepository } from "../src/repositories/tokens.repository";
import { AddTokenHandler } from "../src/handlers/add-token.handler";
import { TokensModel } from "../src/domains/tokens.model";
import { StatusHelper } from "../src/helpers/status.helper";
import { expectThrowsAsync } from "./helpers/expectThrowsAsync";

let expect = chai.expect;

describe("Add new Token", function () {
  let tokensRepository: TokensRepository;
  let addTokenHandler: AddTokenHandler;

  beforeEach(() => {
    sinon.restore();
    tokensRepository = new TokensRepository(TokensModel);
    addTokenHandler = new AddTokenHandler(tokensRepository);
  });

  const req = sinon.stub();
  req.body = {
    tokenName: "Test Token 01",
    tokenAbb: "TT01",
    tokenAddress: "0x123456789",
    tokenSymbol: "AAAAAAAA==",
    tokenStatus: true,
  };

  let res;
  res = {
    _status: null,
    _json: null,
    status: function (code) {
      this._status = code;
      return this;
    },
    send: function (json) {
      this._json = json;
      return this;
    },
  };

  // * Approve condition * //

  it("Add new Token success condition", async () => {
    sinon.stub(tokensRepository, "exists").resolves(false);
    sinon.stub(tokensRepository, "create").resolves(true);
    await addTokenHandler.Handler(req, res);
    expect(res._status).to.equal(StatusHelper.status201Created);
  });

  // ! Reject Condition //

  it("Add new Token conflic condition", async () => {
    sinon.stub(tokensRepository, "exists").resolves(true);
    expect(await expectThrowsAsync(addTokenHandler, req, res)).to.equal(
      StatusHelper.error409Conflict
    );
  });
});
