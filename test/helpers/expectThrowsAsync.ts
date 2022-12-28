export const expectThrowsAsync = async (method: any, req: any, res: any) => {
  let err = null;
  try {
    await method.Handler(req, res);
  } catch (error) {
    err = error;
  }
  return err;
};
