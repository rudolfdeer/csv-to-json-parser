import fs from 'fs';
import { program } from 'commander';
import { pipeline } from 'stream';
import readline from 'readline';
import { google } from 'googleapis';
import { transformer } from './src/transformer.js';

program
  .option('--sourceFile <file>', 'source file')
  .option('--resultFile <file>', 'result file')
  .option('--separator <separator>', 'optional: separator')
  .parse(process.argv);

const { sourceFile, resultFile, separator } = program.opts();

const inputStream = sourceFile ? fs.createReadStream(sourceFile) : process.stdin;
const transformStream = transformer(separator);
const outputStream = resultFile ? fs.createWriteStream(resultFile) : process.stdout;

pipeline(inputStream, transformStream, outputStream, (err) => {
  if (err) {
    process.stderr.write(`pipeline error: ${err}\n`);
    process.exit(1);
  }
});

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}
/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
/**
 * Describe with given media and metaData and upload it using google.drive.create method()
 */
function uploadFile(auth) {
  const drive = google.drive({ version: 'v3', auth });
  const fileMetadata = {
    name: 'result.json',
  };
  const media = {
    mimeType: 'application/json',
    body: fs.createReadStream('./result.json'),
  };
  drive.files.create(
    {
      resource: fileMetadata,
      media: media,
      fields: 'id',
    },
    (err, file) => {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('successfuly downloaded');
      }
    }
  );
}

fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  authorize(JSON.parse(content), uploadFile);
});
