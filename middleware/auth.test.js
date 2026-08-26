import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { protectRoute } from "./auth.js";

describe("protectRoute Middleware", () => {
  let req;
  let res;
  let next;
  let consoleSpy;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test("should return 401 if authorization header is missing", async () => {
    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if authorization header does not start with Bearer", async () => {
    req.headers.authorization = "Basic some_token";

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token verification fails", async () => {
    req.headers.authorization = "Bearer invalid_token";
    jest.spyOn(jwt, "verify").mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if user is not found in database", async () => {
    req.headers.authorization = "Bearer valid_token";
    process.env.JWT_SECRET = "test_secret";

    jest.spyOn(jwt, "verify").mockReturnValue({ userId: "user123" });
    jest.spyOn(User, "findById").mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await protectRoute(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should set req.user and call next() if token and user are valid", async () => {
    req.headers.authorization = "Bearer valid_token";
    process.env.JWT_SECRET = "test_secret";
    const mockUser = { _id: "user123", displayName: "testuser" };

    jest.spyOn(jwt, "verify").mockReturnValue({ userId: "user123" });
    jest.spyOn(User, "findById").mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser),
    });

    await protectRoute(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid_token", "test_secret");
    expect(User.findById).toHaveBeenCalledWith("user123");
    expect(req.user).toEqual(mockUser);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
