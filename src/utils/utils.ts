import { validationResult } from "express-validator";
import cloudinary from "../config/cloudinary.js";
import { Request, Response } from "express";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result?.secure_url || "");
          }
        }
      )
      .end(fileBuffer);
  });
};

export const handleHttpRequestInput = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return res.status(400).json({
      status: "failed",
      message: errorMessages
    });
  }
}

export const generateBookingNumber = () => {
  const prefix = "BK";
  // Current timestamp (last 6 digits)
  const timestamp = Date.now().toString().slice(-6);
  // Random 4 digit number
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
};