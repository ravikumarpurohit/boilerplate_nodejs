import bcrypt from "bcrypt";

const saltRounds = 10;

export const encryptPassword = async (req_password) => {
  try {
    const hash = await bcrypt.genSalt(saltRounds);
    const encryptText = await bcrypt.hash(req_password, hash);
    return encryptText;
  } catch (error) {
    console.log(error);
  }
};

export const checkPassword = async (req_password, db_password) => {
  const isValidPassword = await bcrypt.compare(req_password, db_password);
  return isValidPassword;
};
