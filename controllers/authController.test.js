import { jest } from "@jest/globals";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { register, login } from "./authController.js";

describe("Auth Controller", () => {
  let req;
  let res;
  let consoleErrorSpy;

  beforeEach(() => {
    req = {
      body: {
        firstName: "Bob",
        lastName: "Saget",
        displayName: "User",
        password: "Qqwwee11",
        image: "",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("register", () => {
    test("should register a new user successfully and return 201", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword123");
      jest.spyOn(User.prototype, "save").mockImplementation(function () {
        this._id = "mockUserId123";
        return Promise.resolve(this);
      });

      await register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ displayName: "User" });
      expect(bcrypt.hash).toHaveBeenCalledWith("Qqwwee11", 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: { id: expect.anything(), username: "User" },
      });
    });

    test("should return 400 if user already exists", async () => {
      jest
        .spyOn(User, "findOne")
        .mockResolvedValue({ displayName: "User" });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });

    test("should return 500 if an error occurs during registration", async () => {
      jest
        .spyOn(User, "findOne")
        .mockRejectedValue(new Error("Database error"));

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("login", () => {
    beforeEach(() => {
      req.body = {
        displayName: "User",
        password: "Qqwwee11",
      };
      process.env.JWT_SECRET = "test_secret";
    });

    test("should log in successfully and return 200 with token", async () => {
      const mockUser = {
        _id: "mockUserId123",
        displayName: "User",
        password: "hashedPassword123",
      };

      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);
      jest.spyOn(jwt, "sign").mockReturnValue("mockJwtToken");

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ displayName: "User" });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "Qqwwee11",
        "hashedPassword123"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "mockUserId123" },
        "test_secret",
        { expiresIn: "1d" }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Logged in successfully",
        user: expect.objectContaining({ displayName: "User" }),
        token: "mockJwtToken",
      });
    });

    test("should return 400 if user is not found", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    test("should return 400 if password does not match", async () => {
      const mockUser = {
        _id: "mockUserId123",
        displayName: "User",
        password: "hashedPassword123",
      };

      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    test("should return 500 if an error occurs during login", async () => {
      jest
        .spyOn(User, "findOne")
        .mockRejectedValue(new Error("Database error"));

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});