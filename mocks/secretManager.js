const SECRET_RESPONSE_MOCK = {
  smAuth: {
    "ARN": "arn:aws:secretsmanager:us-east-1:710809157942:secret:intl-co-infra-oficina-linea-secretmanager-01-dev/other/",
    "Name": "intl-co-infra-oficina-linea-secretmanager-01-dev/other/",
    "VersionId": "a90f0c15-0149-4782-be1c-755f78fe8668",
    "SecretString": JSON.stringify({
      KEYDES: "LMCssoUnq_201803LMCssoUnq_201803",
      KEYAPP: "TheBestSecretKey",
      BPM: "LMCssoUnq_201803LMCssoUnq_201803",
      CARS_MNGMNT: "LCssoHoPEuat2019",
    }),
    "VersionStages": ["AWSCURRENT"],
    "CreatedDate": "2023-06-28T18:36:46.742Z",
  },
};

const secretManagerMock = (type) => SECRET_RESPONSE_MOCK[type];

module.exports = {
  SECRET_RESPONSE_MOCK,
  secretManagerMock,
};
