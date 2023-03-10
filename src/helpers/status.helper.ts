import { HttpError } from "../errors/http.error";

export abstract class StatusHelper {
  public static status200OK: number = 200;
  public static status201Created: number = 201;
  public static status202Accepted: number = 202;
  public static status204NoContent: number = 204;

  public static error400BadRequest: HttpError = new HttpError(400);
  public static error401Unauthorized: HttpError = new HttpError(401);
  public static error403Forbidden: HttpError = new HttpError(403);
  public static error404NotFound: HttpError = new HttpError(404);
  public static error409Conflict: HttpError = new HttpError(409);
}
