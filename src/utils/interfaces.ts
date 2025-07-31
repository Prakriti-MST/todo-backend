import { Request } from "express";
export interface ICustomerRequestUser extends Request {
  user?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  cookies: {
    token?: string;
  };
  body: {
    token?: string;
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
  };
}
