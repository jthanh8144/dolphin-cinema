import { Client } from 'minio'

export const minioClient = new Client({
  endPoint: process.env.MINIO_HOST,
  port: +process.env.MINIO_PORT,
  useSSL: false,
  accessKey: process.env.MINIO_USER,
  secretKey: process.env.MINIO_PASSWORD,
})
