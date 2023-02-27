const { Annex } = require("../../models");
const path = require("path");
const fs = require("fs/promises");
const annexesDir = path.join(__dirname, "../", "../", "storage", "annexes");

const addAnnex = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { kpKey, annexNumber, annexNote, budget } = req.body;

  const annexes = [];

  if (req.files) {
    const annexUrls = await Promise.all(
      req.files.map(async item => {
        const { path: tempUpload, originalname } = item;

        const resultUpload = path.join(annexesDir, originalname);

        await fs.rename(tempUpload, resultUpload);
        const annexURL = path.join("annexes", originalname);
        return annexURL;
      })
    );
    annexes.push(...annexUrls);
  }

  const docsArray = JSON.stringify(annexes);

  const annexParams = { kpKey, userId, annexNumber, annexNote, docsArray, budget };

  const newAnnex = new Annex(annexParams);

  const newAnnexId = await newAnnex.add();

  const annex = await Annex.getByid(newAnnexId);

  res.status(201).json({
    message: `Annex ${annex.annexNumber} Created`,
    annex,
  });
};

module.exports = addAnnex;
