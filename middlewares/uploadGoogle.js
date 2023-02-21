const { Storage } = require("@google-cloud/storage");
const { BadRequest } = require("http-errors");
const path = require("path");
const fs = require("fs/promises");

const projectid = "fiery-aspect-378014";

const keyFilename = path.join(__dirname, "../", "/config", "key.json");

// const storage = new Storage({
//   projectid,
//   keyFilename,
// });
const contractsDir = path.join(__dirname, "../", "storage", "contracts");
const annexesDir = path.join(__dirname, "../", "storage", "annexes");
const screenshotsDir = path.join(__dirname, "../", "storage", "screenshots");

const uploadFile = async (req, res, next) => {
  const { contract: contracts } = req.files;

  contracts.map(async item => {
    const { path: tempUpload, originalname } = item;

    try {
      const resultUpload = path.join(contractsDir, originalname);
      await fs.rename(tempUpload, resultUpload);
      const contractURL = path.join("contracts", originalname);

      res.json({
        contractURL,
      });

      // const bucketName = "ba3a-file-storage";
      // const filePath = req.file.path;

      // const result = await storage.bucket(bucketName).upload(filePath);
      // console.log(result, "result of upploading");
      // console.log(`${filePath} uploaded to ${bucketName}`);
    } catch (error) {
      console.log(error);
      await fs.unlink(tempUpload);
      throw error;
    }
  });
};

module.exports = uploadFile;
