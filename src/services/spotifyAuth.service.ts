import SpotifyWebApi from 'spotify-web-api-node'

class SpotifyAuthService {
  private spotifyApi: SpotifyWebApi

  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    })
  }

  public async getAuthUrl(): Promise<string> {
    return this.spotifyApi.createAuthorizeURL(
      [
        'user-read-private',
        'user-read-email',
        'playlist-modify-private',
        'playlist-modify-public',
      ],
      'state'
    )
  }

  authorizationCodeGrant(authorizationCode: string) {
    return this.spotifyApi.authorizationCodeGrant(authorizationCode)
  }
  setRefreshToken(refresh_token: any) {
    this.spotifyApi.setRefreshToken(refresh_token)
  }
  setAccessToken(access_token: any) {
    this.spotifyApi.setAccessToken(access_token)
  }
  searchPlaylists(query: string) {
    return this.spotifyApi.searchPlaylists(query)
  }
  getPlaylistTracks(playlistId: string) {
    return this.spotifyApi.getPlaylistTracks(playlistId)
  }
  getMe() {
    return this.spotifyApi.getMe()
  }
  getUserPlaylists(userId: string) {
    return this.spotifyApi.getUserPlaylists(userId)
  }
}

const spotifyAuthService = new SpotifyAuthService()

export { spotifyAuthService }
