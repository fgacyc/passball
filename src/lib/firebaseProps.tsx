import { DatabaseProvider, FirestoreProvider, useFirebaseApp } from "reactfire";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import type { ReactNode } from "react";

export const FirebaseProps = ({ children }: { children: ReactNode }) => {
  const app = useFirebaseApp();

  const firestoreInstance = getFirestore(app);
  const database = getDatabase(app);
  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <DatabaseProvider sdk={database}>{children}</DatabaseProvider>
    </FirestoreProvider>
  );
};
