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
  console.log(`[SERVER]: Fetching user... ${req.body.email}`)
  const user = await fbAdminApp.auth().getUserByEmail(req.body.email)
  if (user) {
    console.log(`[UID VALIDATION]: ${req.body.uid == user.uid}`)
    await fbAdminApp.auth().setCustomUserClaims(user.uid, {
      "owner": true
    })
    res.send("SUCCESS")
  } else {
    res.send("ERROR: user not found")
  }
})

app.listen(PORT, () => console.log(`[SERVER]: started listening to port ${PORT}`))