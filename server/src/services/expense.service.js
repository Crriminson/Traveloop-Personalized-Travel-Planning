const prisma = require('../config/db');
const AppError = require('../utils/AppError');
const tripService = require('./trip.service');

exports.getExpenses = async (tripId, userId) => {
  await tripService.getTripById(tripId, userId); // verify access
  return prisma.expense.findMany({ where: { tripId }, orderBy: { createdAt: 'desc' } });
};

exports.createExpense = async (userId, data) => {
  await tripService.getTripById(data.tripId, userId);
  return prisma.expense.create({ data });
};

exports.updateExpense = async (id, userId, data) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) throw new AppError('Expense not found', 404);
  await tripService.getTripById(expense.tripId, userId);
  return prisma.expense.update({ where: { id }, data });
};

exports.deleteExpense = async (id, userId) => {
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense) throw new AppError('Expense not found', 404);
  await tripService.getTripById(expense.tripId, userId);
  return prisma.expense.delete({ where: { id } });
};
