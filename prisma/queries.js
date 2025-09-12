const prisma = require("./client");

async function getAllUsers() {
  return prisma.user.findMany({
    include: {
      posts: true,
    },
  });
}

async function createUserTest() {
  await prisma.user.create({
    data: {
      email: "david@gmail.com",
      name: "David",
      posts: {
        create: { title: "Hello World" },
      },
    },
  });
}

module.exports = { getAllUsers, createUserTest };
