const { getCompanies } = require("../controllers/callDatabases");

const getCompaniesInfo = async () => {
  const response = await getCompanies();
  const companiesInfo =  response.Items.map(item => ({
    companyName: item.data["RAZON_SOCIAL"] || "",
    companyNit: item.data["NIT"] || "",
    companyCode: item.data["CODIGO_COMPANIA"] || "",
    companyNameCode: item.data["CODIGO_ALFA"] || "",
    companyRepresentative: item.data["REPRESENTANTE_LEGAL"] || "",
    companyContact: item.data["NOMBRE_ENCARGADO"] || "",
  }));

  const allCompaniesInfo = companiesInfo.map(item => [item.companyNit, item]);
  const filteredCompaniesInfo = new Map(allCompaniesInfo);
  const uniqueCompanies = [ ...filteredCompaniesInfo.values() ];

  return uniqueCompanies;
};

module.exports = {
  getCompaniesInfo,
};
