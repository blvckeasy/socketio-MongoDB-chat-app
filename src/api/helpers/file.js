import Fs from 'fs/promises';
import Path from 'path';
import { getCurrentDate } from './date.js';
import { ForbiddenError, InternalServerError, InvalidDataException } from './error.js'
import { generateRandomNumber } from './random.generate.js'

export async function CreateOrAppendFile (path, data) {
  try {
    await Fs.appendFile(path, data, {
      encoding: "utf-8",
    })

    return data;
  } catch (error) {
    throw error;
  }
}

export async function WriteFile(path, data, options) {
  try {
    await Fs.writeFile(path, data, {
      encoding: options?.encoding || 'utf-8',
      flag: options?.flag,
      mode: options?.mode,
      signal: options?.signal,
    });

    return data;
  } catch (error) {
    throw error;
  }
}

export async function ReadFile(path) {
  try {
    const data = await Fs.readFile(path, {
      encoding: "utf-8",
    });

    return data;
  } catch (error) {
    throw error;
  }
}

export async function AppendErrorToFile(error, filename = getCurrentDate()) {
  try {
    const error_file_path = Path.join(process.cwd(), 'src', 'api', 'logs', 'errors', filename + '.log');

    await Fs.appendFile(error_file_path, JSON.stringify(error, null, 4) + '\n', {
      encoding: "utf-8",
    })

    return error;
  } catch (error) {
    throw error;
  }
}

export function getFileExtension(filename) {
  if(!filename) throw new InternalServerError("filename not found!");
  return filename.split('.').pop();
}

export async function writeProfileImage(file, options) {
  if (!file) throw new InternalServerError("file is require!");
  const { buffer, originalname, mimetype } = file;

  console.log('mimetype:', mimetype);
  
  if (mimetype?.split('/')[0] != 'image') throw new InvalidDataException("Just upload a picture!")

  const file_name = `${generateRandomNumber(16)}.${getFileExtension(originalname)}`;
  const path = Path.join(process.cwd(), "files", "profile-images", file_name);
  
  await WriteFile(path, buffer, options);
  
  return file_name;
}