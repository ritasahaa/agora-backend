require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
app.use(cors());
app.use(express.json());

const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;

app.get('/', (req, res) => res.send('Agora token server running'));


app.get('/token', (req, res) => {
  const channelName = req.query.channel;
  let uid = req.query.uid ? Number(req.query.uid) : 0;

  if (!channelName) return res.status(400).json({ error: 'channel query param required' });

  // token expiry in seconds (e.g., 1 hour)
  const expirationTimeInSeconds = 86400;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTs = currentTimestamp + expirationTimeInSeconds;

  // Build token (role: publisher for client)
  const role = RtcRole.PUBLISHER;
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTs
  );

  return res.json({ appId: APP_ID, token, channel: channelName, uid });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Token server running on port ${PORT}`));