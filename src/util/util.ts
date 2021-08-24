import fs from 'fs';
import { readdir } from 'fs/promises';
import Jimp = require('jimp');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file

export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    let photo;
    try {
      photo = await Jimp.read(inputURL);
    } catch (err) {
      reject(err);
    }
    // const photo = await Jimp.read(inputURL);
    const outpath =
      '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
    const imagePath = __dirname + outpath;
    if (photo)
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(imagePath, (img) => {
          resolve(imagePath);
        });
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles() {
  const dir = __dirname + '/tmp';
  const files = await readdir(dir);
  for (let file of files) {
    console.log(file);
    fs.unlinkSync(`${dir}/${file}`);
  }
}
