const {
  FCM_TYPE,
  FCM_PROJECT_ID,
  FCM_PRIVATE_KEY_ID,
  FCM_PRIVATE_KEY,
  FCM_CLIENT_EMAIL,
  FCM_CLIENT_ID,
  FCM_AUTH_URL,
  FCM_TOKEN_URL,
  FCM_AUTH_PROVIDER_CERT_URL,
  FCM_CLIENT_CERT_URL
} = process.env

export default serviceAccount = {
  type: FCM_TYPE,
  project_id: FCM_PROJECT_ID,
  private_key_id: FCM_PRIVATE_KEY_ID,
  private_key: FCM_PRIVATE_KEY,
  client_email: FCM_CLIENT_EMAIL,
  client_id: FCM_CLIENT_ID,
  auth_uri: FCM_AUTH_URL,
  token_uri: FCM_TOKEN_URL,
  auth_provider_x509_cert_url: FCM_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: FCM_CLIENT_CERT_URL
}
