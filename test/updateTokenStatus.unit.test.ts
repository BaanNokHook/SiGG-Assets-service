import "reflect-metadata";
import sinon from "sinon";
import chai from "chai";

import { TokensRepository } from "../src/repositories/tokens.repository";
import { UpdateTokenHandler } from "../src/handlers/update-token.handler";
import { TokensModel } from "../src/domains/tokens.model";
import { StatusHelper } from "../src/helpers/status.helper";
import { expectThrowsAsync } from "./helpers/expectThrowsAsync";

let expect = chai.expect;

describe("Update Token status", function () {
  let tokensRepository: TokensRepository;
  let updateTokenHandler: UpdateTokenHandler;

  beforeEach(() => {
    sinon.restore();
    tokensRepository = new TokensRepository(TokensModel);
    updateTokenHandler = new UpdateTokenHandler(tokensRepository);
  });

  const req = sinon.stub();
  req.body = {
    _id: "6316e5287a0e3ce56d212747",
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

  it("Update Token status success condition", async () => {
    sinon.stub(tokensRepository, "exists").resolves(true);
    sinon.stub(tokensRepository, "updateOne").resolves(true);
    await updateTokenHandler.Handler(req, res);
    expect(res._status).to.equal(StatusHelper.status200OK);
  });

  // ! Reject Condition //

  it("Update Token status conflic condition", async () => {
    sinon.stub(tokensRepository, "exists").resolves(false);
    expect(await expectThrowsAsync(updateTokenHandler, req, res)).to.equal(
      StatusHelper.error404NotFound
    );
  });
});
