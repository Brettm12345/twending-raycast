import { getPreferenceValues } from "@raycast/api";
import { ViewTrendingRepositories } from "./view-trending-repositories";

export default function ViewDefaultLanguage() {
  const preferences = getPreferenceValues<ExtensionPreferences>();
  const { defaultLanguage } = preferences;
  return <ViewTrendingRepositories language={defaultLanguage ?? "All Languages"} />;
}
