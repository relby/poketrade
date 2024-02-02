import { index, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { UUIDv4 } from 'src/common/types';
import { UserEntity, usersTable } from './users.table';
import { relations } from 'drizzle-orm';

// TODO: Create trigger in sql migration
export const userRefreshTokensTable = pgTable('user_refresh_tokens', {
  userId: uuid('user_id')
    .$type<UUIDv4>()
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  hashedRefreshToken: text('hashed_refresh_token')
    .notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true })
    .notNull(),
}, (table) => ({
  primaryKey: primaryKey({ columns: [table.userId, table.hashedRefreshToken] }),
  userIdIdx: index().on(table.userId),
  hashedRefreshTokenIdx: index().on(table.hashedRefreshToken),
}));

export const userRefreshTokensTableRelations = relations(userRefreshTokensTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userRefreshTokensTable.userId],
    references: [usersTable.id],
  }),
}));

export type UserRefreshTokenEntity = typeof userRefreshTokensTable.$inferSelect & {
  user: UserEntity,
};
export type CreateUserRefreshTokenEntityValues = Omit<typeof userRefreshTokensTable.$inferInsert, 'userId'> & {
  user: UserEntity,
};
