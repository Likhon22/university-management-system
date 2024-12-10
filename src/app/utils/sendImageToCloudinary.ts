/* eslint-disable @typescript-eslint/no-unused-vars */
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import config from '../config';
import fs from 'fs';
import AppError from '../error/AppError';
export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  // Configuration
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret, // Click 'View API Keys' above to copy your API secret
  });

  try {
    const result = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    });
    fs.unlink(path, err => {
      if (err) {
        console.error('An error occurred:', err);
      } else {
        console.log('File deleted successfully!');
      }
    });

    return result;
  } catch (error) {
    throw new AppError(400, 'Image upload failed');
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
