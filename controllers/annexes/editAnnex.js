const { Annex } = require("../../models");
const path = require("path");
const fs = require("fs/promises");
const annexesDir = path.join(__dirname, "../", "../", "storage", "annexes");

const editAnnex = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { annexId, annexNumber, annexNote, budget } = req.body;

  const { docsArray: annexes } = await Annex.getByid(annexId);

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

  const annexParams = { userId, annexNumber, annexNote, docsArray, budget };

  const updatedContract = new Annex(annexParams);

  await updatedContract.update(annexId);

  const annex = await Annex.getByid(annexId);

  res.status(201).json({
    message: `Annex ${annex.annexNumber} Updated`,
    annex,
  });
};

module.exports = editAnnex;
