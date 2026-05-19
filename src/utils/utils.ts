import { validationResult } from "express-validator";
import cloudinary from "../config/cloudinary.js";
import { Request, Response } from "express";
import { PutObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import { env } from "../config/env.js";
import { s3 } from "../config/s3.js";

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
export const handleHttpRequestInput = async (
  req: Request, 
  res: Response
) => {
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
export const calculateTotalDays = (
  start_date: Date,
  end_date: Date
) => {
  const diffTime = end_date.getTime() - start_date.getTime();
  const totalDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );
  return totalDays;
}
export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimetype: string,
  folder: string
): Promise<string> => {
  const uniqueFileName =
    `${folder}/${crypto.randomUUID()}-${fileName}`;
  // new PutObjectCommand()
  // new DeleteObjectCommand()
  // new GetObjectCommand()
  const command = new PutObjectCommand({
    Bucket: env.AWS_S3_BUCKET!,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: mimetype,
  });
  await s3.send(command);
  return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
};
export const deleteFromS3 = async (
    key: string
): Promise<void> => {
    const command =
        new DeleteObjectCommand({
            Bucket: env.AWS_S3_BUCKET,
            Key: key,
        });
    await s3.send(command);
};