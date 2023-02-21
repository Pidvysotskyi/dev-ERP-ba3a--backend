const path = require("path");
const fs = require("fs/promises");

const contractsDir = path.join(__dirname, "../", "storage", "contracts");
const annexesDir = path.join(__dirname, "../", "storage", "annexes");
const screenshotsDir = path.join(__dirname, "../", "storage", "screenshots");

const uploadFiles = async (req, res, next) => {
  const { contract, annex, screenshot } = req.files;

  const contracts = [];
  const annexes = [];
  const screenshots = [];

  if (contract) {
    const contractUrls = await Promise.all(
      contract.map(async item => {
        const { path: tempUpload, originalname } = item;

        const resultUpload = path.join(contractsDir, originalname);

        await fs.rename(tempUpload, resultUpload);
        const contractURL = path.join("contracts", originalname);
        return contractURL;
      })
    );
    contracts.push(...contractUrls);
  }

  if (annex) {
    const annexUrls = await Promise.all(
      annex.map(async item => {
        const { path: tempUpload, originalname } = item;

        const resultUpload = path.join(annexesDir, originalname);

        await fs.rename(tempUpload, resultUpload);
        const annexURL = path.join("annexes", originalname);
        return annexURL;
      })
    );
    annexes.push(...annexUrls);
  }

  if (screenshot) {
    const screenshotUrls = await Promise.all(
      screenshot.map(async item => {
        const { path: tempUpload, originalname } = item;

        const resultUpload = path.join(screenshotsDir, originalname);

        await fs.rename(tempUpload, resultUpload);
        const screenshotURL = path.join("screenshots", originalname);
        return screenshotURL;
      })
    );
    screenshots.push(screenshotUrls);
  }

  req.body.fileURLs = {
    contracts,
    annexes,
    screenshots,
  };

  next();
};

module.exports = uploadFiles;
