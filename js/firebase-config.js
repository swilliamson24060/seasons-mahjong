// The Firebase project behind the leaderboard: its Web API Key, which begins
// AIza (the app id beside it in the console is something else), and its
// project id, both from the Firebase console (Project settings, General).
// Neither is a secret: every web app sends both from the browser, and what
// players may do is settled by firestore.rules. With no key there is no
// leaderboard, and the game says nothing of one. Seasons has a project of its
// own, as Boneyard's boards are Boneyard's.
export const FIREBASE = {
  apiKey: 'AIzaSyA2CrQp5Zi1C-FD-T9PkqG1yLSvV7ugPfg',
  projectId: 'seasons-mahjong',
};
