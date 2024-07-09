const { getModules, getUserModules } = require("../controllers/callDatabases");

const getModulesToRender = async (userId) => {
  const allModules = await getModules();
  const { modules: userModules = [] } = await getUserModules(userId);
  const enabledModules = allModules.filter(({ data: { status } }) => status);
  const enabledNameModules = enabledModules.map(({ data: { name } }) => name);
  const availableModules = userModules.filter(modName => enabledNameModules.includes(modName));

  return availableModules;
};

const getModulesToAdminAndGestor= async () => {
  const allModules = await getModules();
  const enabledModules = allModules.filter(({ data: { status } }) => status);
  const enabledNameModules = enabledModules.map(({ data: { name } }) => name);
  const availableModules = enabledNameModules;
  return availableModules;
};

module.exports = {
  getModulesToRender,
  getModulesToAdminAndGestor
};
