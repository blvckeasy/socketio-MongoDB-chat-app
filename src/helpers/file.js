import Fs from 'fs/promises';
import Path from 'path';
import { getCurrentDate } from './date.js';

export async function CreateOrAppendFile (path, data) {
  try {
    await Fs.appendFile(path, data, {
      encoding: "utf-8",
    })

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function WriteFile(path, data) {
  try {
    await Fs.writeFile(path, data, {
      encoding: "utf-8"
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function ReadFile(path) {
  try {
    const data = await Fs.readFile(path, {
      encoding: "utf-8",
    });

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function AppendErrorToFile(error, filename = getCurrentDate()) {
  try {
    const error_file_path = Path.join(process.cwd(), 'src', 'logs', 'errors', filename + '.log');

    await Fs.appendFile(error_file_path, JSON.stringify(error, null, 4) + '\n', {
      encoding: "utf-8",
    })

    return error;
  } catch (error) {
    throw new Error(error);
  }
}