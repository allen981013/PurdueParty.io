import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", request, {structuredData: true});
  response.send("Hello from Firebase!");
});

const admin = require('firebase-admin')
admin.initializeApp()

/**
 * Logs all database activity
 *
 * @type {CloudFunction<Change<DocumentSnapshot>>}
 */
exports.dbLogger = functions.firestore
  .document('{collection}/{id}')
  .onWrite(async (change, context) => {
    const {collection, id} = context.params;
    if (collection !== 'firestore_log') {
      const event = context.eventType;
      const data = change.after.data();
      const created_at = Date.now();
      admin.firestore().collection('firestore_log').add({collection, id, event, data, created_at});
      functions.logger.info("DB operation: " + collection + ", " + id + ", " + event + ", " + data + ", " + created_at)
    }
  });
