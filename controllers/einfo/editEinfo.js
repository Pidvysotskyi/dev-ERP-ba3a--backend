const { Einfo } = require("../../models");
const path = require("path");
const fs = require("fs/promises");
const screenshotsDir = path.join(__dirname, "../", "../", "storage", "screenshots");

const editEinfo = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { einfoId, einfoNote } = req.body;

  const screenshots = [];

  if (req.files) {
    const screenshotUrls = await Promise.all(
      req.files.map(async item => {
        const { path: tempUpload, originalname } = item;

        const resultUpload = path.join(screenshotsDir, originalname);

        await fs.rename(tempUpload, resultUpload);
        const screenshotURL = path.join("screenshots", originalname);
        return screenshotURL;
      })
    );
    screenshots.push(...screenshotUrls);
  }

  const docsArray = JSON.stringify(screenshots);

  const einfoParams = { userId, einfoNote, docsArray };

  const updatedEinfo = new Einfo(einfoParams);

  await updatedEinfo.update(einfoId);

  const einfo = await Einfo.getByid(einfoId);

  res.status(201).json({
    message: `EInfo ${einfo.einfoNote} Updated`,
    einfo,
  });
};

module.exports = editEinfo;
