const { z } = require('zod');

const ExpenseCategory = ['TRANSPORT', 'ACCOMMODATION', 'ACTIVITIES', 'MEALS', 'SHOPPING', 'MISCELLANEOUS'];

const createExpenseSchema = z.object({
  body: z.object({
    tripId: z.string().uuid(),
    stopId: z.string().uuid().optional(),
    category: z.enum(ExpenseCategory),
    amount: z.number().positive(),
    description: z.string().optional(),
    date: z.string().datetime().optional()
  })
});

const updateExpenseSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    category: z.enum(ExpenseCategory).optional(),
    amount: z.number().positive().optional(),
    description: z.string().optional(),
    date: z.string().datetime().optional()
  })
});

module.exports = { createExpenseSchema, updateExpenseSchema };
