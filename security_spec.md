# Security Specification — Mampi Weds Durgesh Wall of Blessings

## 1. Data Invariants
1. Every document in `/blessings/{blessingId}` must have a valid alphanumeric/hyphen/underscore document ID (`isValidId(blessingId)`).
2. Every blessing must contain only the exact allowed keys (`name`, `relation`, `guests`, `attending`, `message`, `timestamp`, `likes`, `visibility`, `createdAt`) and all required keys must be present.
3. String fields must strictly obey volumetric bounds (`name <= 100`, `relation <= 100`, `guests <= 60`, `attending <= 120`, `message <= 1000`, `timestamp <= 60`, `visibility == 'public'`).
4. On creation, `likes` must be `0` or `1`, and `createdAt` must equal `request.time`.
5. On update, only the `likes` field may change (`affectedKeys().hasOnly(['likes'])`), incremented or decremented by at most 1 (`incoming().likes >= 0 && incoming().likes <= 10000`), while all other fields (`name`, `relation`, `guests`, `attending`, `message`, `timestamp`, `visibility`, `createdAt`) remain strictly immutable.
6. List queries must filter by `resource.data.visibility == 'public'`.

## 2. The "Dirty Dozen" Payloads
1. **Ghost Field Injection**: `{ name: "Guest", ..., isAdmin: true }` -> Rejected by `hasOnly()`.
2. **Oversized Message**: `{ message: "A".repeat(5000), ... }` -> Rejected by `message.size() <= 1000`.
3. **Empty Name**: `{ name: "", ... }` -> Rejected by `name.size() >= 1`.
4. **Spoofed Timestamp**: `{ createdAt: timestamp.date(2020, 1, 1), ... }` -> Rejected by `incoming().createdAt == request.time`.
5. **Poisoned Document ID**: `/blessings/invalid$id!@#` -> Rejected by `isValidId(blessingId)`.
6. **Unauthorized Message Mutation on Update**: Updating `message` on an existing blessing -> Rejected by `affectedKeys().hasOnly(['likes'])`.
7. **Immutable `createdAt` Mutation**: Updating `createdAt` -> Rejected by `incoming().createdAt == existing().createdAt`.
8. **Negative Likes**: `{ likes: -5 }` -> Rejected by `data.likes >= 0`.
9. **Like Inflation Attack**: Incrementing `likes` by +500 in one write -> Rejected by `incoming().likes == existing().likes + 1 || incoming().likes == existing().likes - 1`.
10. **Invalid Visibility Enum**: `{ visibility: "private" }` -> Rejected by `data.visibility == 'public'`.
11. **Document Deletion Attempt**: `delete /blessings/{id}` -> Rejected (`allow delete: if false`).
12. **Unfiltered Scraping**: `list /blessings` without `visibility == 'public'` -> Rejected by `resource.data.visibility == 'public'`.
