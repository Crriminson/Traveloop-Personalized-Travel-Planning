# Traveloop — Database Guidelines

Use PostgreSQL with Prisma ORM. All IDs are UUIDs. Schema is fully normalized — no business logic in JSON blobs.

**DB design is the primary evaluation criterion. Every table and relationship must be intentional and defensible.**

---

## Full Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// USERS

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  name          String
  avatarUrl     String?
  languagePref  String    @default("en")
  role          UserRole  @default(USER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  tripsCreated    Trip[]         @relation("TripCreator")
  tripMemberships TripMember[]
  notes           TripNote[]
  refreshTokens   RefreshToken[]

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}

enum UserRole { USER ADMIN }

// CITIES (seeded)

model City {
  id              String     @id @default(uuid())
  name            String
  country         String
  region          String?
  latitude        Float
  longitude       Float
  costIndex       Int        // 1=Budget 2=Mid 3=Splurge
  popularityScore Int        @default(0)
  description     String?
  imageUrl        String?
  timezone        String?
  createdAt       DateTime   @default(now())

  tripStops       TripStop[]
  activities      Activity[]

  @@index([name])
  @@index([country])
  @@map("cities")
}

// TRIPS

model Trip {
  id            String     @id @default(uuid())
  creatorId     String
  name          String
  description   String?
  coverPhotoUrl String?
  startDate     DateTime?
  endDate       DateTime?
  status        TripStatus @default(PLANNING)
  isPublic      Boolean    @default(false)
  shareToken    String     @unique @default(uuid())
  totalBudget   Float?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  creator           User               @relation("TripCreator", fields: [creatorId], references: [id])
  members           TripMember[]
  stops             TripStop[]
  expenses          Expense[]
  packingItems      PackingItem[]
  notes             TripNote[]
  budgetAllocations BudgetAllocation[]

  @@index([creatorId])
  @@index([shareToken])
  @@index([status])
  @@map("trips")
}

enum TripStatus { PLANNING ONGOING COMPLETED CANCELLED }

model TripMember {
  id       String     @id @default(uuid())
  tripId   String
  userId   String
  role     MemberRole @default(VIEWER)
  joinedAt DateTime   @default(now())

  trip     Trip       @relation(fields: [tripId], references: [id], onDelete: Cascade)
  user     User       @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([tripId, userId])
  @@index([tripId])
  @@index([userId])
  @@map("trip_members")
}

enum MemberRole { OWNER EDITOR VIEWER }

// STOPS

model TripStop {
  id         String    @id @default(uuid())
  tripId     String
  cityId     String
  orderIndex Int
  startDate  DateTime?
  endDate    DateTime?
  notes      String?
  createdAt  DateTime  @default(now())

  trip       Trip           @relation(fields: [tripId], references: [id], onDelete: Cascade)
  city       City           @relation(fields: [cityId], references: [id])
  activities StopActivity[]
  tripNotes  TripNote[]

  @@index([tripId])
  @@index([cityId])
  @@map("trip_stops")
}

// ACTIVITIES (seeded catalog + user-created custom)

model Activity {
  id              String           @id @default(uuid())
  name            String
  description     String?
  cityId          String?          // null = generic, usable anywhere
  category        ActivityCategory
  costPerPerson   Float            @default(0)
  isFree          Boolean          @default(false)
  durationMinutes Int?
  imageUrl        String?
  rating          Float?
  isCustom        Boolean          @default(false)
  createdAt       DateTime         @default(now())

  city           City?          @relation(fields: [cityId], references: [id])
  stopActivities StopActivity[]

  @@index([cityId])
  @@index([category])
  @@map("activities")
}

enum ActivityCategory {
  SIGHTSEEING FOOD ADVENTURE CULTURAL RELAXATION SHOPPING TRANSPORT ACCOMMODATION OTHER
}

// Junction: activities scheduled within a stop
model StopActivity {
  id          String    @id @default(uuid())
  stopId      String
  activityId  String?   // null if fully custom (no catalog entry)
  customName  String?   // used when activityId is null
  startTime   String?   // "HH:MM"
  endTime     String?   // "HH:MM"
  cost        Float     @default(0)
  notes       String?
  orderIndex  Int       @default(0)
  dayOffset   Int       @default(0) // day relative to stop start date (0-indexed)
  isLocked    Boolean   @default(false)

  stop        TripStop  @relation(fields: [stopId], references: [id], onDelete: Cascade)
  activity    Activity? @relation(fields: [activityId], references: [id])

  @@index([stopId])
  @@map("stop_activities")
}

// BUDGET

model BudgetAllocation {
  id        String          @id @default(uuid())
  tripId    String
  category  ExpenseCategory
  allocated Float           @default(0)

  trip      Trip            @relation(fields: [tripId], references: [id], onDelete: Cascade)

  @@unique([tripId, category])
  @@index([tripId])
  @@map("budget_allocations")
}

model Expense {
  id          String          @id @default(uuid())
  tripId      String
  stopId      String?
  category    ExpenseCategory
  amount      Float
  description String?
  date        DateTime?
  createdAt   DateTime        @default(now())

  trip        Trip            @relation(fields: [tripId], references: [id], onDelete: Cascade)

  @@index([tripId])
  @@map("expenses")
}

enum ExpenseCategory {
  TRANSPORT ACCOMMODATION ACTIVITIES MEALS SHOPPING MISCELLANEOUS
}

// PACKING

model PackingItem {
  id        String          @id @default(uuid())
  tripId    String
  name      String
  category  PackingCategory @default(MISCELLANEOUS)
  isPacked  Boolean         @default(false)
  createdAt DateTime        @default(now())

  trip      Trip            @relation(fields: [tripId], references: [id], onDelete: Cascade)

  @@index([tripId])
  @@map("packing_items")
}

enum PackingCategory {
  CLOTHING DOCUMENTS ELECTRONICS TOILETRIES MEDICATIONS MISCELLANEOUS
}

// NOTES

model TripNote {
  id        String    @id @default(uuid())
  tripId    String
  stopId    String?
  userId    String
  title     String?
  content   String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  trip      Trip      @relation(fields: [tripId], references: [id], onDelete: Cascade)
  stop      TripStop? @relation(fields: [stopId], references: [id])
  user      User      @relation(fields: [userId], references: [id])

  @@index([tripId])
  @@index([userId])
  @@map("trip_notes")
}
```

---

## Design Rationale

**`TripStop` is its own entity** — not just a city tag on a trip. It holds a date range, an order index, and owns activities. This is what enables multi-city, day-wise planning with reordering.

**`StopActivity` handles both catalog and custom activities** via nullable `activityId` + `customName`. One table, two modes, no duplication.

**`BudgetAllocation` vs `Expense` are separate** — allocations are planning targets, expenses are actuals. This is what enables "allocated vs. spent per category" charts cleanly.

**`shareToken` is a UUID on `Trip`** — decoupled from the internal ID. Regeneratable anytime. Safe for public URLs.

**`deletedAt` on `User`** — soft delete preserves relational integrity when an account is removed.

**`dayOffset` on `StopActivity`** — stores which day within a stop an activity falls on (0 = first day, 1 = second, etc.), without requiring a full date field.

---

## Seed Requirements

Seed script at `prisma/seed.js` must populate:

- **30+ cities** across multiple regions. Each needs: name, country, region, lat/lng, costIndex, popularityScore, description, imageUrl — use picsum: `https://picsum.photos/seed/{cityname}/800/600` (e.g. `https://picsum.photos/seed/paris/800/600`). Same seed word always returns the same image.
- **4–8 activities per city** covering varied `ActivityCategory` values. Mix free and paid. Include realistic costPerPerson, durationMinutes, rating.
- **1 admin user:** `admin@traveloop.com` / `Admin@1234`, role `ADMIN`

All application data must come from the database. No hardcoded arrays in route handlers or frontend files.
