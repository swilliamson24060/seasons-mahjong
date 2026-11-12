// The Firebase project behind the leaderboard: its web API key and its
// project id, from the Firebase console (Project settings, General, Your
// apps). Neither is a secret: every web app sends both from the browser, and
// what players may do is settled by firestore.rules. With no key there is no
// leaderboard, and the game says nothing of one. Seasons has none yet: it
// wants a Firebase project of its own, as Boneyard's boards are Boneyard's.
export const FIREBASE = {
  apiKey: '',
  projectId: '',
};
