import { createUser, updateUser, toggleUser, listUsers, getUser } from './users.service.js'

export async function createUserController(req, res) {
  const u = await createUser(req.validated.body)
  res.status(201).json({ ok: true, user: { id: u.id, email: u.email, name: u.name, roleIds: u.roleIds, active: u.active } })
}

export async function updateUserController(req, res) {
  await updateUser(req.validated.params.id, req.validated.body)
  res.json({ ok: true })
}

export async function toggleUserController(req, res) {
  await toggleUser(req.validated.params.id, req.validated.body.active)
  res.json({ ok: true })
}

export async function listUsersController(req, res) {
  const validatedQuery = req.validated?.query
  const limit = Number(validatedQuery?.limit ?? req.query?.limit ?? 20)
  const cursor = validatedQuery?.cursor ?? req.query?.cursor

  res.json({
    ok: true,
    ...(await listUsers({
      limit: Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 20,
      cursor: typeof cursor === 'string' ? cursor : undefined
    }))
  })
}

export async function getUserController(req, res) {
  res.json({ ok: true, user: await getUser(req.params.id) })
}
