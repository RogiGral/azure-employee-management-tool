import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  output,
} from '@azure/functions'
import { spotifyAuthService } from '../services/spotifyAuth.service'

const outputQueue = output.storageQueue({
  queueName: 'spotify-token-queue',
  connection: 'STORAGE_ACCOUNT_CONNECTION',
})

export async function callbackSpotifyAuth(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const authorizationCode = request.query.get('code')

  try {
    const data = await spotifyAuthService.authorizationCodeGrant(
      authorizationCode
    )
    const { access_token, refresh_token } = data.body

    spotifyAuthService.setAccessToken(access_token)
    spotifyAuthService.setRefreshToken(refresh_token)

    context.extraOutputs.set(outputQueue, { access_token, refresh_token })

    return {
      status: 200,
      body: JSON.stringify({ access_token, refresh_token }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  } catch (error) {
    context.error('Error retrieving tokens:', error)
  }
}

app.http('callbackSpotifyAuth', {
  methods: ['GET'],
  authLevel: 'anonymous',
  extraOutputs: [outputQueue],
  handler: callbackSpotifyAuth,
})
