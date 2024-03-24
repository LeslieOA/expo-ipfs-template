import { ConfigContext, ExpoConfig } from "@expo/config";

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: "expo-ipfs-template",
  slug: "expo-ipfs-template",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier:
      process.env.EXPO_PUBLIC_EXPO_CONFIG_IDENTIFIER ||
      "com.example.expo-ipfs-template",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
});
