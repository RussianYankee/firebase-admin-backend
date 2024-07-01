import express from 'express'
import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from '../firebase-service-acc.json'

const PORT = 3000
const app = express()

app.use(express.json())

process.env['FIREBASE_AUTH_EMULATOR_HOST'] =  '127.0.0.1:9099'

const fbAdminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

//REST
app.post('/signup', async (req, res) => {
  if (req.body.token) {
      fbAdminApp.auth().verifyIdToken(req.body.token).then(async (token) => {
      await fbAdminApp.auth().setCustomUserClaims(token.uid, {
        "owner": true,
        "authorities": [
          "canReadThis",
          "canWriteThat"
        ]
      })
      res.send("SUCCESS")
    }).catch((err) => res.send(err))
  } else {
    res.send("INCOMPLETE REQUEST DATA")
  }
})

app.listen(PORT, () => console.log(`[SERVER]: started listening to port ${PORT}`))