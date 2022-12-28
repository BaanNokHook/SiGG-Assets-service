import { BodyRequest } from "commands/BodyRequest";
import { Response } from "express";

export interface ICommandHandler<RequestCommand> {
  Handler(req: BodyRequest<RequestCommand>, res: Response);
}
export interface IGetHandler {
  Handler(res: Response);
}
