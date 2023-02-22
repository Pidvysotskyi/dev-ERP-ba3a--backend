const { Einfo, Project } = require("../../models");
const path = require("path");
const fs = require("fs/promises");
const screenshotsDir = path.join(__dirname, "../", "../", "storage", "screenshots");

const addEinfo = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { projectKey, einfoNote } = req.body;

  const { orgStructureId } = await Project.getByKey(projectKey);

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

  const einfoParams = { projectKey, orgStructureId, userId, einfoNote, docsArray };

  const newEinfo = new Einfo(einfoParams);

  const newEinfoId = await newEinfo.add();

  const einfo = await Einfo.getByid(newEinfoId);

  res.status(201).json({
    message: `EInfo ${einfo.einfoNote} Created`,
    einfo,
  });
};

module.exports = addEinfo;
