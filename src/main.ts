import 'dotenv/config'
import {
  appProvider,
  databaseProvider,
  envLoadProvider,
  socketProvider,
} from '@shared/providers'
import {
  firebaseAdminConfig,
  firebaseUserAuthConfig,
  firebaseAdminAuthConfig,
} from '@shared/configs/firebase.config'
import { initializeApp, cert } from 'firebase-admin/app'
import { initializeApp as initializeAppClient } from 'firebase/app'

envLoadProvider.validate()

socketProvider.init()

appProvider.listen()

databaseProvider.initialize()

initializeApp({
  credential: cert(firebaseAdminConfig as any),
})

initializeAppClient(firebaseUserAuthConfig)
initializeAppClient(firebaseAdminAuthConfig, 'adminAuth')
