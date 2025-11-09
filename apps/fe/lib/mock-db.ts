// lib/mock-db.ts
import { cookies } from "next/headers"
import { jwtVerify, JWTPayload } from "jose"
import { randomUUID } from "crypto"
import path from "path"
import fs from "fs/promises"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-key-change-in-production")
const DB_PATH = path.join(process.cwd(), "data", "db.json")

// ==== Types ====
export type UserRole = "DONOR" | "ORG_ADMIN" | "AUDITOR" | "SUPERADMIN"

export interface SessionPayload extends JWTPayload {
  userId: string
  email: string
  role: UserRole
  isAnonymous?: boolean
  anonId?: string
  name?: string
}

export interface Campaign {
  id: string
  title: string
  slug: string
  summary: string
  goal: number
  raised: number
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED"
  ownerId: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CampaignRequest {
  id: string
  title: string
  details: string
  requestedBy: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  reason?: string
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: "SYSTEM" | "CAMPAIGN" | "APPROVAL"
  title: string
  message: string
  meta?: Record<string, any>
  read: boolean
  createdAt: string
}

export interface Follow {
  userId: string
  campaignId: string
  createdAt: string
}

export interface Activity {
  id: string
  type:
    | "DONATION_CREATED"
    | "CAMPAIGN_REQUESTED"
    | "CAMPAIGN_APPROVED"
    | "CAMPAIGN_REJECTED"
    | "FOLLOWED"
    | "UNFOLLOWED"
    | "SYSTEM"
  actorId: string
  targetType: "CAMPAIGN" | "REQUEST" | "NOTIFICATION" | "SYSTEM"
  targetId?: string
  meta?: Record<string, any>
  createdAt: string
}

export type DonationStatus = "PLEDGED" | "ESCROWED" | "SETTLED" | "REFUNDED"

export interface Donation {
  id: string
  campaignId: string
  userId: string
  amount: number
  status: DonationStatus
  txId: string
  paymentMethod: "MOCK_QR" | "BANK_TRANSFER" | "CARD"
  message?: string
  createdAt: string
  onchainAt?: string
}

export interface DBShape {
  users: Array<{ userId: string; email: string; role: UserRole; name?: string }>
  campaigns: Campaign[]
  campaignRequests: CampaignRequest[]
  notifications: Notification[]
  follows: Follow[]
  activities: Activity[]
  donations: Donation[]
}

// ==== Ensure DB & initial seed ====
async function ensureDb() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    const now = new Date().toISOString()

    const seed: DBShape = {
      users: [
        { userId: "u_donor", email: "donor@demo.dev", role: "DONOR", name: "Nhà hảo tâm Demo" },
        { userId: "u_org", email: "org@demo.dev", role: "ORG_ADMIN", name: "Tổ chức Demo" },
        { userId: "u_auditor", email: "auditor@demo.dev", role: "AUDITOR", name: "Kiểm toán Demo" },
        { userId: "u_admin", email: "admin@demo.dev", role: "SUPERADMIN", name: "Quản trị Demo" },
      ],
      campaigns: [
        {
          id: "c_mien-trung-lu-lut",
          title: "Cứu trợ khẩn cấp miền Trung mùa lũ",
          slug: "cuu-tro-mien-trung",
          summary:
            "Hỗ trợ nhu yếu phẩm, máy lọc nước và di dời an toàn cho các hộ dân bị ảnh hưởng do mưa lũ tại miền Trung.",
          goal: 500_000_000,
          raised: 0,
          status: "ACTIVE",
          ownerId: "u_org",
          tags: ["cứu trợ", "thiên tai", "khẩn cấp"],
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "c-sua-truong-vung-cao",
          title: "Sửa lớp học tạm vùng cao",
          slug: "sua-lop-hoc-vung-cao",
          summary:
            "Tu sửa phòng học, bổ sung bàn ghế và vật dụng mùa đông cho học sinh tại điểm trường vùng cao.",
          goal: 300_000_000,
          raised: 0,
          status: "ACTIVE",
          ownerId: "u_org",
          tags: ["giáo dục", "trẻ em", "cơ sở vật chất"],
          createdAt: now,
          updatedAt: now,
        },
      ],
      campaignRequests: [],
      notifications: [],
      follows: [],
      activities: [],
      donations: [],
    }

    await fs.writeFile(DB_PATH, JSON.stringify(seed, null, 2), "utf8")
  }
}
function ensureArray<T = any>(v: any): T[] {
  return Array.isArray(v) ? v : []
}

async function migrateDbObject(obj: any): Promise<{ db: any; changed: boolean }> {
  let changed = false
  const db = { ...obj }

  // đảm bảo các bảng luôn tồn tại dạng mảng
  const keys = [
    "users",
    "campaigns",
    "campaignRequests",
    "notifications",
    "follows",
    "activities",
    "donations", // mới thêm
  ]
  for (const k of keys) {
    if (!Array.isArray(db[k])) {
      db[k] = []
      changed = true
    }
  }

  // vệ sinh tối thiểu từng collection (optional, đề phòng null)
  db.campaigns = ensureArray(db.campaigns)
  db.campaignRequests = ensureArray(db.campaignRequests)
  db.notifications = ensureArray(db.notifications)
  db.follows = ensureArray(db.follows)
  db.activities = ensureArray(db.activities)
  db.donations = ensureArray(db.donations)

  return { db, changed }
}

async function readDb(): Promise<DBShape> {
  await ensureDb()
  const raw = await fs.readFile(DB_PATH, "utf8")
  const parsed = JSON.parse(raw)

  const { db, changed } = await migrateDbObject(parsed)
  if (changed) {
    // nếu schema cũ thiếu field → ghi lại file để lần sau khỏi migrate nữa
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8")
  }

  return db as DBShape
}

async function writeDb(next: DBShape) {
  const tmp = DB_PATH + ".tmp"
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8")
  await fs.rename(tmp, DB_PATH)
}

// ==== Auth helper (read JWT from cookie & verify) ====
export async function getAuthUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as SessionPayload
  } catch {
    return null
  }
}

// ==== Campaign helpers ====
export async function listCampaigns() {
  const db = await readDb()
  return db.campaigns
}

export async function getCampaignById(id: string) {
  const db = await readDb()
  return db.campaigns.find((c) => c.id === id) || null
}

export async function upsertCampaign(input: Partial<Campaign> & { title: string; ownerId: string }) {
  const db = await readDb()
  const now = new Date().toISOString()
  const slug =
    input.slug ||
    input.title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")

  if (input.id) {
    const idx = db.campaigns.findIndex((c) => c.id === input.id)
    if (idx >= 0) {
      db.campaigns[idx] = {
        ...db.campaigns[idx],
        ...input,
        slug,
        updatedAt: now,
      } as Campaign
    } else {
      db.campaigns.push({
        id: input.id,
        title: input.title,
        slug,
        summary: input.summary || "",
        goal: input.goal ?? 0,
        raised: input.raised ?? 0,
        status: (input.status as any) || "DRAFT",
        ownerId: input.ownerId,
        tags: input.tags || [],
        createdAt: now,
        updatedAt: now,
      })
    }
  } else {
    db.campaigns.push({
      id: randomUUID(),
      title: input.title,
      slug,
      summary: input.summary || "",
      goal: input.goal ?? 0,
      raised: input.raised ?? 0,
      status: (input.status as any) || "DRAFT",
      ownerId: input.ownerId,
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    })
  }

  await writeDb(db)
  return db.campaigns.find((c) => c.slug === slug)!
}

// ==== Campaign request (approve/reject + notify) ====
export async function requestNewCampaign(params: {
  title: string
  details: string
  requestedBy: string
}) {
  const db = await readDb()
  const now = new Date().toISOString()
  const req: CampaignRequest = {
    id: randomUUID(),
    title: params.title,
    details: params.details,
    requestedBy: params.requestedBy,
    status: "PENDING",
    createdAt: now,
    updatedAt: now,
  }
  db.campaignRequests.push(req)

  db.activities.push({
    id: randomUUID(),
    type: "CAMPAIGN_REQUESTED",
    actorId: params.requestedBy,
    targetType: "REQUEST",
    targetId: req.id,
    meta: { title: req.title },
    createdAt: now,
  })

  await writeDb(db)
  return req
}

export async function approveCampaignRequest(reqId: string, actorId: string, reason?: string) {
  const db = await readDb()
  const now = new Date().toISOString()
  const req = db.campaignRequests.find((r) => r.id === reqId)
  if (!req) throw new Error("Không tìm thấy yêu cầu chiến dịch")
  req.status = "APPROVED"
  req.reason = reason
  req.updatedAt = now

  // Notify requester
  db.notifications.push({
    id: randomUUID(),
    userId: req.requestedBy,
    type: "APPROVAL",
    title: "Yêu cầu chiến dịch đã được duyệt",
    message: `Chiến dịch “${req.title}” đã được duyệt. ${reason ? "Ghi chú: " + reason : ""}`,
    read: false,
    createdAt: now,
  })

  db.activities.push({
    id: randomUUID(),
    type: "CAMPAIGN_APPROVED",
    actorId: actorId,
    targetType: "REQUEST",
    targetId: reqId,
    meta: { reason },
    createdAt: now,
  })

  await writeDb(db)
  return req
}

export async function rejectCampaignRequest(reqId: string, actorId: string, reason: string) {
  const db = await readDb()
  const now = new Date().toISOString()
  const req = db.campaignRequests.find((r) => r.id === reqId)
  if (!req) throw new Error("Không tìm thấy yêu cầu chiến dịch")
  req.status = "REJECTED"
  req.reason = reason
  req.updatedAt = now

  // Notify requester
  db.notifications.push({
    id: randomUUID(),
    userId: req.requestedBy,
    type: "APPROVAL",
    title: "Yêu cầu chiến dịch bị từ chối",
    message: `Chiến dịch “${req.title}” bị từ chối. Lý do: ${reason}`,
    read: false,
    createdAt: now,
  })

  db.activities.push({
    id: randomUUID(),
    type: "CAMPAIGN_REJECTED",
    actorId: actorId,
    targetType: "REQUEST",
    targetId: reqId,
    meta: { reason },
    createdAt: now,
  })

  await writeDb(db)
  return req
}

// ==== Notifications ====
export async function listNotifications(userId: string) {
  const db = await readDb()
  return db.notifications.filter((n) => n.userId === userId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function notify(
  userId: string,
  payload: Omit<Notification, "id" | "userId" | "createdAt" | "read">
) {
  const db = await readDb()
  const now = new Date().toISOString()
  const n: Notification = {
    id: randomUUID(),
    userId,
    read: false,
    createdAt: now,
    ...payload,
  }
  db.notifications.push(n)
  db.activities.push({
    id: randomUUID(),
    type: "SYSTEM",
    actorId: userId,
    targetType: "NOTIFICATION",
    targetId: n.id,
    meta: { title: n.title },
    createdAt: now,
  })
  await writeDb(db)
  return n
}

// ==== Follow ====
export async function followCampaign(userId: string, campaignId: string) {
  const db = await readDb()
  const now = new Date().toISOString()
  if (!db.follows.find((f) => f.userId === userId && f.campaignId === campaignId)) {
    db.follows.push({ userId, campaignId, createdAt: now })
    db.activities.push({
      id: randomUUID(),
      type: "FOLLOWED",
      actorId: userId,
      targetType: "CAMPAIGN",
      targetId: campaignId,
      createdAt: now,
    })
    await writeDb(db)
  }
  return { ok: true }
}

export async function unfollowCampaign(userId: string, campaignId: string) {
  const db = await readDb()
  const now = new Date().toISOString()
  const next = db.follows.filter((f) => !(f.userId === userId && f.campaignId === campaignId))
  if (next.length !== db.follows.length) {
    db.follows = next
    db.activities.push({
      id: randomUUID(),
      type: "UNFOLLOWED",
      actorId: userId,
      targetType: "CAMPAIGN",
      targetId: campaignId,
      createdAt: now,
    })
    await writeDb(db)
  }
  return { ok: true }
}

export async function getFollowingDetails(userId: string) {
  const db = await readDb()
  const followIds = db.follows.filter((f) => f.userId === userId).map((f) => f.campaignId)
  const campaigns = db.campaigns.filter((c) => followIds.includes(c.id))
  const latestActivities = db.activities
    .filter((a) => a.targetType === "CAMPAIGN" && a.targetId && followIds.includes(a.targetId))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(0, 50)

  return { campaigns, latestActivities }
}
// ==== Campaign requests list (role-aware) ====
export async function listCampaignRequests(forUserId?: string, role?: UserRole) {
  const db = await (async () => {
    // dùng readDb() nội bộ
    const raw = await (await import("fs/promises")).readFile(
      (await import("path")).join(process.cwd(), "data", "db.json"),
      "utf8"
    )
    return JSON.parse(raw) as DBShape
  })()

  // Chưa đăng nhập thì không trả gì
  if (!forUserId) return []

  // Admin / Auditor / Org Admin → xem tất cả
  if (role === "SUPERADMIN" || role === "AUDITOR" || role === "ORG_ADMIN") {
    return db.campaignRequests.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  }

  // Donor / user thường → chỉ xem request của mình
  return db.campaignRequests
    .filter((r) => r.requestedBy === forUserId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

// ==== Donations ====
export async function listDonations(userId?: string) {
  const db = await readDb()
  const arr = userId ? db.donations.filter((d) => d.userId === userId) : db.donations
  // sort newest first
  return arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export async function createDonation(params: {
  userId: string
  campaignId: string
  amount: number
  paymentMethod: Donation["paymentMethod"]
  message?: string
}) {
  const db = await readDb()
  const now = new Date().toISOString()

  const campaign = db.campaigns.find((c) => c.id === params.campaignId)
  if (!campaign) throw new Error("Không tìm thấy chiến dịch")

  const donation: Donation = {
    id: randomUUID(),
    campaignId: params.campaignId,
    userId: params.userId,
    amount: Math.max(0, Math.floor(params.amount || 0)),
    status: "ESCROWED",
    txId: `TXN-${Math.random().toString(36).slice(2, 10).toUpperCase()}`,
    paymentMethod: params.paymentMethod || "MOCK_QR",
    message: params.message,
    createdAt: now,
  }

  db.donations.push(donation)

  // (Demo) Update campaign
  campaign.raised = Math.max(0, (campaign.raised || 0) + donation.amount)
  campaign.updatedAt = now

  // Activity
  db.activities.push({
    id: randomUUID(),
    type: "DONATION_CREATED",
    actorId: params.userId,
    targetType: "CAMPAIGN",
    targetId: params.campaignId,
    meta: { amount: donation.amount, txId: donation.txId },
    createdAt: now,
  })

  await writeDb(db)
  return donation
}
