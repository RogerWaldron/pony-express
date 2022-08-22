const bcrypt = require("bcrypt");
const salt = 10;

const users = require("../fixtures/users");

const generateHash = async (password) => {
  let hash = await bcrypt.hashSync(password, salt);
  return hash;
};

const compareHash = async (password, user) => {
  return new Promise(async (resolve, reject) => {
    let cmp = await bcrypt.compare(password, user.password);
    resolve(cmp ? user : undefined);
  });
};

const findUser = async (username, password) => {
  let usrPrm = await Promise.all(
    users
      .filter((user) => user.username === username)
      .map((user) => compareHash(password, user))
  )
    .then((response) => {
      return response.find((u) => u !== undefined) || undefined;
    })
    .catch((error) => {
      return undefined;
    });
  return usrPrm;
};

let findUserByToken = async ({ userId }) => {
  return users.find((u) => u.id === userId);
};

let findUserByCredentials = async ({ username, password }) => {
  return await findUser(username, password);
};

exports.byToken = findUserByToken;
exports.byCredentials = findUserByCredentials;
