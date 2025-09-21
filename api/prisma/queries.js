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
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      published: true,
      // authorId: { select: { id: true, name: true } },
    },
  });
}

async function setPostPublishedStatus({ id, published }) {
  return prisma.post.update({
    where: { id: Number(id) },
    data: { published },
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
      published: true,
    },
  });
}

async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    select: {
      id: true,
      title: true,
      createdAt: true,
      published: true,
      // authorId: { select: { id: true, name: true } },
    },
  });
}

async function createPost(post_title, content, userId) {
  return prisma.post.create({
    data: {
      title: post_title,
      content: content,
      authorId: userId,
    },
  });
}

async function updatePost({ id, post_title, content }) {
  return prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: post_title,
      content: content,
    },
  });
}

async function findPostById(id) {
  return prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  });
}

async function deletePost(id) {
  return prisma.post.delete({
    where: {
      id: Number(id),
    },
  });
}

// --- COMMENTS ----

async function createComment(postId, userId, content) {
  return prisma.comment.create({
    data: {
      content: content,
      userId: userId,
      postId: postId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, name: true } },
    },
  });
}

async function getPostComments(postId) {
  return prisma.comment.findMany({
    where: { postId: postId },
    select: {
      id: true,
      content: true,
      user: { select: { id: true, name: true } },
      createdAt: true,
    },
  });
}

async function deleteComment(id) {
  return prisma.comment.delete({
    where: {
      id: Number(id),
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
  getPublishedPosts,
  createPost,
  updatePost,
  findPostById,
  createComment,
  getPostComments,
  deletePost,
  deleteComment,
  setPostPublishedStatus,
};
