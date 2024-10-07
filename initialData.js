const { getCards, createCard } = require("./cards/models/cardsAccessDataService");
const { getUsers, registerUser } = require("./users/models/usersAccessDataService");

const cardsMockData = [
    {
        title: "first card",
        subtitle: "this is the first card",
        description: "this is the first card in the database",
        phone: "052-1111111",
        email: "firstcard@gmail.com",
        image: {
            url: "https://cdn.pixabay.com/photo/2015/05/31/12/14/business-791174_960_720.jpg",
            alt: "business card image"
        },
        address: {
            state: "abc",
            country: "sample",
            city: "sample",
            street: "sample",
            houseNumber: 10,
            zip: 12345
        },
        bizNumber: 3305969,
        user_id: "6702884fb4ec0829691f8827"
    },
    {
        title: "second card",
        subtitle: "this is the second card",
        description: "this is the second card in the database",
        phone: "052-2222222",
        email: "secondcard@gmail.com",
        image: {
            url: "https://cdn.pixabay.com/photo/2016/10/13/09/06/laptop-1737910_960_720.jpg",
            alt: "laptop business card image"
        },
        address: {
            state: "def",
            country: "sample",
            city: "sample",
            street: "sample",
            houseNumber: 20,
            zip: 54321
        },
        bizNumber: 4412345,
        user_id: "6702884fb4ec0829691f8827"
    },
    {
        title: "third card",
        subtitle: "this is the third card",
        description: "this is the third card in the database",
        phone: "052-3333333",
        email: "thirdcard@gmail.com",
        image: {
            url: "https://cdn.pixabay.com/photo/2016/03/27/21/32/computer-1283968_960_720.jpg",
            alt: "computer business card image"
        },
        address: {
            state: "ghi",
            country: "sample",
            city: "sample",
            street: "sample",
            houseNumber: 30,
            zip: 67890
        },
        bizNumber: 5507890,
        user_id: "6702884fb4ec0829691f8827"
    }
];

const usersMockData = [
    {
        name: {
            first: "John",
            middle: "A.",
            last: "Doe"
        },
        phone: "0555555555",
        email: "johndoe@email.com",
        password: "Example1!",
        image: {
            url: "https://example.com/johndoe.jpg",
            alt: "John Doe"
        },
        address: {
            state: "California",
            country: "USA",
            city: "Los Angeles",
            street: "Main St",
            houseNumber: "101",
            zip: "90001"
        },
        isBusiness: false,
        isAdmin: false
    },
    {
        name: {
            first: "Jane",
            middle: "B.",
            last: "Smith"
        },
        phone: "0555555556",
        email: "janesmith@email.com",
        password: "Example1!",
        image: {
            url: "https://example.com/janesmith.jpg",
            alt: "Jane Smith"
        },
        address: {
            state: "New York",
            country: "USA",
            city: "New York City",
            street: "Broadway",
            houseNumber: "202",
            zip: "10001"
        },
        isBusiness: true,
        isAdmin: false
    },
    {
        name: {
            first: "Alice",
            middle: "C.",
            last: "Johnson"
        },
        phone: "0555555557",
        email: "alicejohnson@email.com",
        password: "Example1!",
        image: {
            url: "https://example.com/alicejohnson.jpg",
            alt: "Alice Johnson"
        },
        address: {
            state: "Texas",
            country: "USA",
            city: "Houston",
            street: "Main Ave",
            houseNumber: "303",
            zip: "77001"
        },
        isBusiness: true,
        isAdmin: true
    }
];

const getAllCardsAndInitial = async () => {
    let cards = await getCards();
    for (const cardObject of cardsMockData) {
        const existingCard = cards.find(card => card.bizNumber === cardObject.bizNumber);
        if (!existingCard) {
            await createCard(cardObject);
        }
    }
    console.log("Initial Cards Added");
};

const getAllUsersAndInitial = async () => {
    let users = await getUsers();
    for (const user of usersMockData) {
        const existingUser = users.find(u => u.email === user.email);
        if (!existingUser) {
            await registerUser(user);
        }
    }
    console.log("Initial Users Added");
};

module.exports = { getAllCardsAndInitial, getAllUsersAndInitial };
