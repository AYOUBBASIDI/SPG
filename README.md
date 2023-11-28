# SPG
This project provides a versatile solution for users who want to enjoy their Spotify playlists offline by downloading the tracks in MP3 format, leveraging the extensive content available on YouTube.

## Getting Started

### Prerequisites

Before running the script, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a .env file in the project root and add your Spotify API credentials:
   ```bash
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

4. **Running the Script:**
Run the Script:
   ```bash
   node code.js
   ```

5. **Enter the Playlist ID:**
When prompted, enter the Spotify Playlist ID. You can find it in the playlist URL after /playlist/. For example:
   ```bash
   Playlist URL: https://open.spotify.com/playlist/1HJ85phFbGEHi4KMu3NpTP?si=e7fd90703c954e1d
   Playlist ID: 1HJ85phFbGEHi4KMu3NpTP?si=e7fd90703c954e1d
   ```
   
6. **Wait for the Script to Finish:**
The script will fetch the playlist information, search for each track on YouTube, and download the audio. It will create an MP3 folder in the project directory and save the converted audio files there.

### Troubleshooting
If you encounter any issues during installation or execution, check the error messages for guidance.
Make sure your Spotify API credentials are correctly set in the .env file.

### Contributing
If you would like to contribute to the project, please follow these steps:

### Fork the repository
Create a new branch: git checkout -b feature/new-feature
Commit your changes: git commit -am 'Add new feature'
Push to the branch: git push origin feature/new-feature
Submit a pull request

### License
This project is licensed under the MIT License - see the LICENSE file for details.

Feel free to open an issue if you face persistent problems or have suggestions for improvement.
