import { jest } from "@jest/globals";
import cloudinary from "../config/cloudinary.js";
import { User } from "../models/User.js";
import {
  getProfilePic,
  uploadProfilePic,
  changeProfilePic,
} from "./imageController.js";

describe("Image Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { id: "user123", username: "User" },
      file: { buffer: Buffer.from("fake-image-data") },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

describe("getProfilePic", () => {
    test("should return 200 with the profile image url", async () => {
      req.user.image = "http://example.com/old.jpg";

      await getProfilePic(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        image: "http://example.com/old.jpg",
      });
    });
  });

  describe("uploadProfilePic", () => {
    const uploadHandler = uploadProfilePic[1];

    test("should upload image to cloudinary and return url", async () => {
      const mockStream = { end: jest.fn() };
      jest
        .spyOn(cloudinary.uploader, "upload_stream")
        .mockImplementation((options, callback) => {
          callback(null, { secure_url: "http://cloudinary.com/new.jpg" });
          return mockStream;
        });

      await uploadHandler(req, res);

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { folder: "chatapp" },
        expect.any(Function),
      );
      expect(mockStream.end).toHaveBeenCalledWith(req.file.buffer);
      expect(res.json).toHaveBeenCalledWith({
        url: "http://cloudinary.com/new.jpg",
      });
    });

    test("should return 500 if cloudinary returns an error", async () => {
      const mockStream = { end: jest.fn() };
      jest
        .spyOn(cloudinary.uploader, "upload_stream")
        .mockImplementation((options, callback) => {
          callback(new Error("Cloudinary error"), null);
          return mockStream;
        });

      await uploadHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Error uploading image");
    });

    test("should return 500 if an exception occurs during upload stream creation", async () => {
      req.file = undefined; // Will cause stream.end(req.file.buffer) to throw

      jest
        .spyOn(cloudinary.uploader, "upload_stream")
        .mockReturnValue({ end: jest.fn() });

      await uploadHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Error uploading image");
    });
  });

  describe("changeProfilePic", () => {
    const changeHandler = changeProfilePic[1];

    test("should upload image to cloudinary, update user record, and return url", async () => {
      const mockStream = { end: jest.fn() };
      jest
        .spyOn(cloudinary.uploader, "upload_stream")
        .mockImplementation((options, callback) => {
          callback(null, { secure_url: "http://cloudinary.com/profile.jpg" });
          return mockStream;
        });

      jest.spyOn(User, "findByIdAndUpdate").mockResolvedValue({});

      await changeHandler(req, res);

      expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
        { folder: "chatapp" },
        expect.any(Function),
      );
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith("user123", {
        image: "http://cloudinary.com/profile.jpg",
      });
      expect(res.json).toHaveBeenCalledWith({
        url: "http://cloudinary.com/profile.jpg",
      });
    });

    test("should return 500 if cloudinary upload fails when changing profile pic", async () => {
      const mockStream = { end: jest.fn() };
      jest
        .spyOn(cloudinary.uploader, "upload_stream")
        .mockImplementation((options, callback) => {
          callback(new Error("Upload failed"), null);
          return mockStream;
        });

      await changeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Error uploading image");
    });

    test("should return 500 if an exception occurs", async () => {
      req.file = undefined;

      jest
        .spyOn(cloudinary.uploader, "upload_stream")
        .mockReturnValue({ end: jest.fn() });

      await changeHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith("Error uploading image");
    });
  });
});
