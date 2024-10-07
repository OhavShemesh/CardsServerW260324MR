const express = require("express");
const {
  registerUser,
  getUser,
  getUsers,
  loginUser,
  editUser,
  changeBusinessStatus,
  deleteUser,
  changeBizNumber,
} = require("../models/usersAccessDataService");
const auth = require("../../auth/authService");
const { handleError } = require("../../utils/handleErrors");
const {
  validateRegistration,
  validateLogin,
} = require("../validation/userValidationService");
const { generateBizNumber } = require("../../cards/helpers/generateBizNumber");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const error = validateRegistration(req.body);
    if (error) {
      req.errorMessage = `Joi Error: ${error}`;
      return handleError(res, 400, req.errorMessage);
    }

    let user = await registerUser(req.body);
    res.send(user);
  } catch (error) {
    req.errorMessage = error.message || "Failed to register user";
    return handleError(res, error.status || 400, req.errorMessage);
  }
});

router.post("/login", async (req, res) => {
  try {
    const error = validateLogin(req.body);
    if (error) {
      req.errorMessage = `Joi Error: ${error}`;
      return handleError(res, 400, req.errorMessage);
    }

    let { email, password } = req.body;
    const token = await loginUser(email, password);
    res.send(token);
  } catch (error) {
    req.errorMessage = error.message || "Failed to login user";
    return handleError(res, error.status || 400, req.errorMessage);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isAdmin) {
      req.errorMessage = "Only admin can retrieve users";
      return handleError(res, 403, req.errorMessage);
    }
    let users = await getUsers();
    res.send(users);
  } catch (error) {
    req.errorMessage = error.message || "Failed to get users";
    return handleError(res, error.status || 400, req.errorMessage);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;

    if (userInfo._id !== id && !userInfo.isAdmin) {
      req.errorMessage =
        "Authorization Error: Only the same user or admin can get user info";
      return handleError(res, 403, req.errorMessage);
    }

    let user = await getUser(id);
    res.send(user);
  } catch (error) {
    req.errorMessage = error.message || "Failed to get user info";
    return handleError(res, error.status || 400, req.errorMessage);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;
    const changes = req.body;

    if (userInfo._id !== id) {
      req.errorMessage =
        "Authorization Error: Only the same user can edit user info";
      return handleError(res, 403, req.errorMessage);
    }

    let user = await editUser(userInfo._id, changes);
    res.send(user);
  } catch (error) {
    req.errorMessage = error.message || "Failed to edit user info";
    return handleError(res, error.status || 400, req.errorMessage);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;

    if (userInfo._id !== id) {
      req.errorMessage =
        "Authorization Error: Only the same user can change its business status";
      return handleError(res, 403, req.errorMessage);
    }

    let user = await changeBusinessStatus(userInfo._id);
    res.send(user);
  } catch (error) {
    req.errorMessage = error.message || "Failed to change business status";
    return handleError(res, error.status || 400, req.errorMessage);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;

    if (userInfo._id !== id && !userInfo.isAdmin) {
      req.errorMessage =
        "Authorization Error: Only the registered user or admin can delete user";
      return handleError(res, 403, req.errorMessage);
    }

    let user = await deleteUser(userInfo._id);
    res.send(user);
  } catch (error) {
    req.errorMessage = error.message || "Failed to delete user";
    return handleError(res, error.status || 400, req.errorMessage);
  }
});

module.exports = router;
