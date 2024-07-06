import express from 'express'
import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from '../firebase-service-acc.json'
import cors from 'cors'

const PORT = 3000
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

process.env['FIREBASE_AUTH_EMULATOR_HOST'] =  '127.0.0.1:9099'

const fbAdminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

//REST
app.post('/signup', async (req, res) => {
  const {token, role, membership} = req.body
  if (token && role && membership) {
    console.log(`[INFO]: role=${role}; membership=${membership}`)
      fbAdminApp.auth().verifyIdToken(req.body.token).then((decodedToken) => {
        fbAdminApp.auth().setCustomUserClaims(decodedToken.uid, {
          "owner": true,
          "authorities": [
            "canReadThis",
            "canWriteThat"
          ]
        }).then(() => {
          res.status(200).send({
            message: "access granted"
          })
        })
      }).catch((err) => res.status(400).send(err))
  } else {
    res.status(400).send({
      message: "incomplete request data."
    })
  }
})

app.listen(PORT, () => console.log(`[SERVER]: started listening to port ${PORT}`))
