import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // Here we shoud log to on external tool like Datadog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal Server Error' })
})
