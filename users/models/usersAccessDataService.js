const { generateAuthToken } = require("../../auth/providers/jwt");
const _ = require("lodash");
const User = require("./mongodb/User");
const { createError } = require("../../utils/handleErrors");
const { generateUserPassword, comaprePasswords } = require("../helpers/bcrypt");

//1
const registerUser = async (newUser) => {
  try {
    newUser.password = generateUserPassword(newUser.password);
    let user = new User(newUser);
    user = await user.save();

    user = _.pick(user, ["name", "email", "_id"]);

    return user;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//2
const loginUser = async (email, password) => {
  try {
    const userFromDb = await User.findOne({ email });

    if (!userFromDb) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      return createError("Authentication", error);
    }
    if (!comaprePasswords(password, userFromDb.password)) {
      const error = new Error("Invalid email or password");
      error.status = 401;
      return createError("Authentication", error);
    }
    const token = generateAuthToken(userFromDb);
    return token;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//3
const getUsers = async () => {
  try {
    let users = await User.find();
    return users;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//4
const getUser = async (userId) => {
  try {
    let user = await User.findById(userId);
    return user;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//5
const editUser = async (userId, changes) => {
  try {
    await User.findByIdAndUpdate(userId, changes);

  } catch (error) {
    createError("Mongoose", error);
  }
}

//6
const changeBusinessStatus = async (userId) => {
  try {
    let user = await User.findById(userId);
    await user.updateOne({ isBusiness: !user.isBusiness });

  } catch (error) {
    createError("Mongoose", error);
  }
}

//7
const deleteUser = async (userId) => {
  try {
    await User.findByIdAndDelete(userId);

  } catch (error) {
    createError("Mongoose", error);
  }

}



module.exports = { registerUser, getUser, getUsers, loginUser, editUser, changeBusinessStatus, deleteUser };
