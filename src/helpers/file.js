import Fs from 'fs/promises';

export async function CreateOrAppendFile (path, data) {
  try {
    const data = Fs.appendFile(path, data, {
      encoding: "utf-8",
    })
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