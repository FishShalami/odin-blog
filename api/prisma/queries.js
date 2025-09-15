const prisma = require("./client");
const { hashToken } = require("./hashToken");

//--USERS
async function getAllUsers() {
  return prisma.user.findMany({
    include: {
      posts: true,
    },
  });
}

async function findUserById(id) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function createUser(email, name, hashedPassword) {
  return prisma.user.create({
    data: {
      email: email,
      name: name,
      password: hashedPassword,
    },
  });
}

// --- POSTS
async function getAllPosts() {
  return prisma.post.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });
}

//--- AUTH TOKENs ----

// used when we create a refresh token.
// a refresh token is valid for 30 days
// that means that if a user is inactive for more than 30 days, he will be required to log in again
function addRefreshTokenToWhitelist({ refreshToken, userId }) {
  return prisma.refreshToken.create({
    data: {
      hashedToken: hashToken(refreshToken),
      userId,
      expireAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
    },
  });
}

// used to check if the token sent by the client is in the database.
function findRefreshToken(token) {
  return prisma.refreshToken.findUnique({
    where: {
      hashedToken: hashToken(token),
    },
  });
}

// soft delete tokens after usage.
function deleteRefreshTokenById(id) {
  return prisma.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
}

function revokeTokens(userId) {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}

module.exports = {
  getAllUsers,
  createUser,
  findUserById,
  findUserByEmail,
  addRefreshTokenToWhitelist,
  findRefreshToken,
  deleteRefreshTokenById,
  revokeTokens,
  getAllPosts,
};
