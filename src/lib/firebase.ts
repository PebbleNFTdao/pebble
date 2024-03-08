import { FIREBASE_CONFIG } from "@/config";
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";

export const app = initializeApp(JSON.parse(FIREBASE_CONFIG));
export const analytics = getAnalytics(app);
