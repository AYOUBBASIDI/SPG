require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exec } = require('child_process');
const search = require('yt-search');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const readline = require('readline');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

const playlistFolder = './playlist/';

async function getAccessToken() {
    try {
        // Get access token using cURL
        const curlCommand = `curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d "client_id=${clientId}" -d "client_secret=${clientSecret}" -d "grant_type=client_credentials" https://accounts.spotify.com/api/token`;

        const { stdout, stderr } = await new Promise((resolve) => {
            exec(curlCommand, (error, stdout, stderr) => {
                resolve({ stdout, stderr });
            });
        });

        const accessToken = JSON.parse(stdout).access_token;
        return accessToken;
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}

async function createPlaylistFolder() {
    if (!fs.existsSync(playlistFolder)) {
        fs.mkdirSync(playlistFolder);
        console.log(`Created playlist folder: ${playlistFolder}`);
    }
}

async function downloadAndConvertToMP3(videoId, outputPath, fileName) {
    return new Promise((resolve, reject) => {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
      console.log(`Downloading audio from videoId: ${videoId}`);
  
      const stream = ytdl(videoUrl, {filter: 'audioonly'})
  
      const filePath = path.join(outputPath, `${fileName}.mp3`);
  
      ffmpeg.setFfmpegPath(ffmpegPath);
  
      const ffmpegProcess = ffmpeg()
        .input(stream)
        .audioCodec('libmp3lame')
        .toFormat('mp3')
        .on('end', () => {
          // Check if the file exists and has a non-zero size
          const stats = fs.statSync(filePath);
          if (stats.isFile() && stats.size > 0) {
            console.log(`Downloaded and converted ${fileName}.mp3`);
            resolve(filePath);
          } else {
            console.error(`Error: ${fileName}.mp3 is empty or does not exist`);
            reject(new Error(`File ${fileName}.mp3 is empty or does not exist`));
          }
        })
        .on('error', (err) => {
          console.error(`Error downloading and converting: ${err.message}`);
          reject(err);
        })
        .save(filePath);
    });
}

async function getPlaylistInfo(accessToken, playlistId) {
    try {
        await createPlaylistFolder();

        // Get playlist details
        const playlistResponse = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const playlist = playlistResponse.data;

        console.log('Playlist Information:');
        console.log(`Name: ${playlist.name}`);
        console.log(`Description: ${playlist.description}`);
        console.log('Tracks:');

        // Iterate through the tracks
        playlist.tracks.items.forEach(async (item, index) => {
            const track = item.track;
            console.log(`${index + 1}. ${track.name} - ${track.artists.map(artist => artist.name).join(', ')}`);

            // Search for the track on YouTube
            const searchQuery = `${track.name} - ${track.artists[0].name}`;
            const searchResults = await search(searchQuery);
            const videoId = searchResults.all[0].videoId;
            await downloadAndConvertToMP3(videoId, path.join(__dirname, playlistFolder), `${track.name} - ${track.artists[0].name}`);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

async function main() {
    try {
        const accessToken = await getAccessToken();

        // Get playlist ID from the user
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Enter the Spotify Playlist ID: ', async (playlistId) => {
            rl.close();
            await getPlaylistInfo(accessToken, playlistId);
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();