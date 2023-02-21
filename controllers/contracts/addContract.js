const { Contract, Project } = require("../../models");
const path = require("path");
const fs = require("fs/promises");
const contractsDir = path.join(__dirname, "../", "../", "storage", "contracts");

const addContract = async (req, res, next) => {
  const { DA_EMPLOYEE_ID: userId } = req.user;
  const { projectKey, contractNumber, contractNote, contractDeadline } = req.body;

  const { orgStructureId } = await Project.getByKey(projectKey);

  const contracts = [];

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

  const contractParams = { projectKey, orgStructureId, userId, contractNumber, contractNote, contractDeadline, docsArray };

  const newContract = new Contract(contractParams);

  const newContractId = await newContract.add();

  const contract = await Contract.getByid(newContractId);

  res.status(201).json({
    message: `Contract ${contract.contractNumber} Created`,
    contract,
  });
};

module.exports = addContract;
