const { createError } = require("../../utils/handleErrors");
const Card = require("./mongodb/Card");

const config = require("config");
const DB = config.get("DB");


//1
const getCards = async () => {
  try {
    let cards = await Card.find();
    return cards;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//2
const getMyCards = async (userId) => {
  try {
    let cards = await Card.find({ user_id: userId });
    return cards;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//3
const getCard = async (cardId) => {
  try {
    let card = await Card.findById(cardId);
    return card;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//4
const createCard = async (newCard) => {
  if (DB === "mongodb") {
    try {
      let card = new Card(newCard);
      card = await card.save();
      return card;
    } catch (error) {
      return createError("Mongoose", error);
    }
  }
  const error = new Error("there is no other db for this requests");
  error.status = 500;
  return createError("DB", error);
};


//5
const updateCard = async (cardId, newCard) => {
  try {
    let card = await Card.findByIdAndUpdate(cardId, newCard, { new: true });
    return card;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//6
const likeCard = async (cardId, userId) => {
  try {
    let card = await Card.findById(cardId);
    if (!card) {
      const error = new Error(
        "A card with this ID cannot be found in the database"
      );
      error.status = 404;
      return createError("Mongoose", error);
    }
    if (card.likes.includes(userId)) {
      let newLikesArray = card.likes.filter((id) => id != userId);
      card.likes = newLikesArray;
    } else {
      card.likes.push(userId);
    }
    await card.save();
    return card;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//7
const deleteCard = async (cardId) => {
  try {
    let card = await Card.findByIdAndDelete(cardId);
    return card;
  } catch (error) {
    return createError("Mongoose", error);
  }
};

//BONUS 1
const changeBizNumber = async (userId, newBizNumber) => {
  try {
    let user = await Card.findById(userId);
    await user.updateOne({ bizNumber: newBizNumber })

  } catch (error) {
    createError("Mongoose", error);
  }

}


module.exports = {
  createCard,
  getCards,
  getCard,
  getMyCards,
  updateCard,
  deleteCard,
  likeCard,
  changeBizNumber
};
