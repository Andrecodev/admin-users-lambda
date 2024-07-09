const MODULES_MOCK = {
  Items: [
    {
      id: 1,
      data: {
        name: "Module Name 1",
        codeName: "module_code_name_1",
        parent: "Parent",
        status: true,
      },
    },
    {
      id: 2,
      data: {
        name: "Module Name 2",
        codeName: "module_code_name_2",
        status: false,
      },
    },
    {
      id: 3,
      data: {
        name: "module name",
        codeName: "module_code_name",
        status: true,
      },
    },
    {
      id: 4,
      data: {
        name: "Module Name 1",
        codeName: "module_code_name_1",
        parent: "Other Parent",
        status: true,
      },
    },
  ],
};

const USER_MODULES_MOCK = {
  Item: {
    userId: "cc12345500",
    modules: ["Module Name", "Module Name 1", "Module Name 2"],
  },
};

const VALID_MODULES_MOCK = ["Module Name 1"];

module.exports = {
  MODULES_MOCK,
  USER_MODULES_MOCK,
  VALID_MODULES_MOCK,
};
