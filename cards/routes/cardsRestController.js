const express = require("express");
const {
  createCard,
  getCards,
  getCard,
  getMyCards,
  updateCard,
  deleteCard,
  likeCard,
  changeBizNumber,
} = require("../models/cardsAccessDataService");
const auth = require("../../auth/authService");
const { normalizeCard } = require("../helpers/normalizeCard");
const { handleError } = require("../../utils/handleErrors");
const validateCard = require("../validation/cardValidationService");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    let cards = await getCards();
    res.send(cards);
  } catch (error) {
    req.errorMessage = error.message || "Failed to get cards";
    return handleError(res, error.status || 400, req.errorMessage);
  }
});

router.get("/my-cards", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness) {
      req.errorMessage = "Only business users can get their cards";
      return handleError(res, 403, req.errorMessage);
    }
    let card = await getMyCards(userInfo._id);
    res.send(card);
  } catch (error) {
    req.errorMessage = error.message || "Failed to get your cards";
    handleError(res, error.status || 400, req.errorMessage);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let card = await getCard(id);
    res.send(card);
  } catch (error) {
    req.errorMessage = error.message || "Failed to get the card";
    handleError(res, error.status || 400, req.errorMessage);
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness) {
      req.errorMessage = "Only business users can create new cards";
      return handleError(res, 403, req.errorMessage);
    }

    const errorMessage = validateCard(req.body);
    if (errorMessage !== "") {
      req.errorMessage = "Validation error: " + errorMessage;
      return handleError(res, 400, req.errorMessage);
    }

    let card = await normalizeCard(req.body, userInfo._id);
    card = await createCard(card);
    res.status(201).send(card);
  } catch (error) {
    req.errorMessage = error.message || "Failed to create a new card";
    handleError(res, error.status || 400, req.errorMessage);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const newCard = req.body;
    const { id } = req.params;
    const fullCardFromDb = await getCard(id);

    if (
      userInfo._id !== fullCardFromDb.user_id.toString() &&
      !userInfo.isAdmin
    ) {
      req.errorMessage = "Authorization Error: Only the user who created the card or admin can update its details";
      return handleError(res, 403, req.errorMessage);
    }

    const errorMessage = validateCard(newCard);
    if (errorMessage !== "") {
      req.errorMessage = "Validation error: " + errorMessage;
      return handleError(res, 400, req.errorMessage);
    }

    let card = await normalizeCard(newCard, userInfo._id);
    card = await updateCard(id, card);
    res.send(card);
  } catch (error) {
    req.errorMessage = error.message || "Failed to update the card";
    handleError(res, error.status || 400, req.errorMessage);
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    let card = await likeCard(id, userId);
    res.send(card);
  } catch (error) {
    req.errorMessage = error.message || "Failed to like the card";
    handleError(res, error.status || 400, req.errorMessage);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    const { id } = req.params;
    const fullCardFromDb = await getCard(id);

    if (
      userInfo._id !== fullCardFromDb.user_id.toString() &&
      !userInfo.isAdmin
    ) {
      req.errorMessage = "Authorization Error: Only the user who created the card or admin can delete this card";
      return handleError(res, 403, req.errorMessage);
    }

    let card = await deleteCard(id);
    res.send(card);
  } catch (error) {
    req.errorMessage = error.message || "Failed to delete the card";
    handleError(res, error.status || 400, req.errorMessage);
  }
});

router.put("/:id/:newBizNumber", auth, async (req, res) => {
  try {
    const allCards = await getCards();
    const userInfo = req.user;
    const { id } = req.params;
    let { newBizNumber } = req.params;

    if (!userInfo.isAdmin) {
      req.errorMessage = "Authorization Error: Only admin can change biz number";
      return handleError(res, 403, req.errorMessage);
    }

    if (newBizNumber.length !== 7) {
      req.errorMessage = "New biz number from params is not according to regulations";
      return handleError(res, 403, req.errorMessage);
    }

    const bizNumberExists = allCards.some(card => card.bizNumber === newBizNumber);
    if (bizNumberExists) {
      req.errorMessage = "Biz number already exists in one of the cards";
      return handleError(res, 403, req.errorMessage);
    }

    let card = await changeBizNumber(id, newBizNumber);
    res.send(card);
  } catch (error) {
    req.errorMessage = error.message || "Failed to change business number";
    handleError(res, error.status || 400, req.errorMessage);
  }
});

module.exports = router;
