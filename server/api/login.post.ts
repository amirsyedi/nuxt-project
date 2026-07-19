// server/api/login.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // 1. Hardcoded check directly on the backend server
  const VALID_USER = '1'
  const VALID_PASS = '1'

  if (body.username === VALID_USER && body.password === VALID_PASS) {
    
    // 2. This sets the encrypted session cookie via nuxt-auth-utils
    await setUserSession(event, {
      user: {
        username: VALID_USER
      }
    })

    return { success: true }
  }

  // 3. Throw a clean error if credentials do not match
  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: 'Invalid username or password'
  })
})