import express from 'express'
import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from '../firebase-service-acc.json'
import {connectAuthEmulator, getAuth} from "firebase/auth"
import { initializeApp } from 'firebase/app'

const PORT = 3000
const app = express()

app.use(express.json())

const firebaseConfig = {
    apiKey: "AIzaSyBlwawhaQcMq679gWfzDZTB4A1TasmoJxc",
    authDomain: "sample-web-app-547a0.firebaseapp.com",
    projectId: "sample-web-app-547a0",
    storageBucket: "sample-web-app-547a0.appspot.com",
    messagingSenderId: "287969019433",
    appId: "1:287969019433:web:11fe0c2c0f6ab38cc03e38"
};

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)

const fbAdminApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
});

connectAuthEmulator(auth, 'http://localhost:9099')

app.listen(PORT, () => console.log(`[SERVER]: started listening to port ${PORT}`))