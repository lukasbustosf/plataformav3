// server/database/prisma.js
const { PrismaClient } = require('../generated/prisma');

/**
 * @type {import('../generated/prisma').PrismaClient}
 */
const prisma = new PrismaClient();

module.exports = prisma;
