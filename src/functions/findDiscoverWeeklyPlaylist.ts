import { app, InvocationContext } from "@azure/functions";
import { spotifyAuthService } from "../services/spotifyAuth.service";

interface QueueItem {
    access_token: string;
    refresh_token: string;
}


export async function findDiscoverWeeklyPlaylist(queueItem: QueueItem, context: InvocationContext): Promise<void> {
    const { access_token, refresh_token } = queueItem;

    spotifyAuthService.setAccessToken(access_token);
    spotifyAuthService.setRefreshToken(refresh_token);

    const playlistSearchResultObjectList = await spotifyAuthService.searchPlaylists('Discover Weekly');

    const playlistSearchResultObject = playlistSearchResultObjectList.body.playlists.items.find(
        (playlist) => playlist.name === 'Discover Weekly'
    )

    context.log(playlistSearchResultObject);

    const trackList = await spotifyAuthService.getPlaylistTracks(playlistSearchResultObject.id);
    const trackUriList = trackList.body.items.map((item) => item.track.uri);

    context.log(trackUriList);

    const userId = (await spotifyAuthService.getMe()).body.id;
    const userPlaylists = await spotifyAuthService.getUserPlaylists(userId);
    const archivePlaylist = userPlaylists.body.items.find(
        (playlist) => playlist.name === 'Archive of Discover Weekly Spotify'
    );

    context.log(archivePlaylist);

}

app.storageQueue('findDiscoverWeeklyPlaylist', {
    queueName: 'spotify-token-queue',
    connection: 'STORAGE_ACCOUNT_CONNECTION',
    handler: findDiscoverWeeklyPlaylist
});
