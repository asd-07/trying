import { db } from './firebase';

import { getFirestore, collection } from 'firebase/firestore';


const collections = {
  users: collection(db, "users"),
  organizations: collection(db, "organizations"),
  assessments: collection(db, "assessments")

  // Define more collections as needed
};

export default collections;
