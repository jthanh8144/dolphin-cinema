export const firebaseAdminConfig = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
}

export const firebaseUserAuthConfig = {
  apiKey: 'AIzaSyAAZGxoPYMAIYwIJb3d7GUEGr-T2vPVj54',
  authDomain: 'test-fbfcd.firebaseapp.com',
  databaseURL: 'https://test-fbfcd-default-rtdb.firebaseio.com',
  projectId: 'test-fbfcd',
  storageBucket: 'test-fbfcd.appspot.com',
  messagingSenderId: '314875589887',
  appId: '1:314875589887:web:55bc19c76a0502a72348ca',
  measurementId: 'G-NQ5EN3H46F',
}

export const firebaseAdminAuthConfig = {
  apiKey: 'AIzaSyAAZGxoPYMAIYwIJb3d7GUEGr-T2vPVj54',
  authDomain: 'test-fbfcd.firebaseapp.com',
  databaseURL: 'https://test-fbfcd-default-rtdb.firebaseio.com',
  projectId: 'test-fbfcd',
  storageBucket: 'test-fbfcd.appspot.com',
  messagingSenderId: '314875589887',
  appId: '1:314875589887:web:e28f1feec224f5512348ca',
  measurementId: 'G-QT7HMP4MGD',
}
