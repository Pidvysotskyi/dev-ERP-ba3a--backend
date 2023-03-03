const { Contract, Project } = require("../../models");
const path = require("path");
const fs = require("fs/promises");
const contractsDir = path.join(__dirname, "../", "../", "storage", "contracts");

const editContract = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { contractId, contractNumber, contractNote, contractDeadline, budget } = req.body;

  const { docsArray: contracts, project: projectKey } = await Contract.getByid(contractId);

  if (contractDeadline) {
    const modifiedProject = new Project({ userId, contractDeadline });
    await modifiedProject.updateFinDate(projectKey);
  }

  if (req.files) {
    const contractUrls = await Promise.all(
      req.files.map(async item => {
        const { path: tempUpload, originalname } = item;

        const resultUpload = path.join(contractsDir, originalname);

        await fs.rename(tempUpload, resultUpload);
        const contractURL = path.join("contracts", originalname);
        return contractURL;
      })
    );
    contracts.push(...contractUrls);
  }

  const docsArray = JSON.stringify(contracts);

  const contractParams = { userId, contractNumber, contractNote, contractDeadline, docsArray, budget };

  const updatedContract = new Contract(contractParams);

  await updatedContract.update(contractId);

  const contract = await Contract.getByid(contractId);

  res.status(201).json({
    message: `Contract ${contract.contractNumber} Updated`,
    contract,
  });
};

module.exports = editContract;
