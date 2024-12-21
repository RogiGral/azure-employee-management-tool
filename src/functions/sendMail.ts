import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions'
import { spotifyAuthService } from '../services/spotifyAuth.service'
import { mailService } from '../services/mail.service'

export async function sendMail(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const authUrl = await spotifyAuthService.getAuthUrl()

    await mailService.sendMail(
      process.env.MAIL_USERNAME,
      'Spotify Discover Weekly Archive',
      `<p>Welcome to your Spotify Archive Creator</p>
      <p>Here is your redirect response:</p>
      <pre>${JSON.stringify(authUrl)}</pre>`
    )

    context.log('Email sent successfully')

    return {
      status: 200,
      body: JSON.stringify({
        message: 'Email sent successfully',
      }),
    }
  } catch (error) {
    return {
      status: 500,
      body: JSON.stringify({
        message: error.message,
        error: error,
      }),
    }
  }
}

app.http('sendMail', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: sendMail,
})
