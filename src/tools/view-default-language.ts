import { getPreferenceValues } from "@raycast/api";
import { fetchRepos } from "../fetch-repos";
import type { ReponsitoryToolResult } from "../repository-response";
type Input = {
  period: "daily" | "weekly" | "monthly";
};
export default async function viewTrendingRepositories(input: Input): Promise<ReponsitoryToolResult[]> {
  const { period } = input;
  const { defaultLanguage } = getPreferenceValues<ExtensionPreferences>();
  const { data } = await fetchRepos({ language: defaultLanguage ?? "All Languages", period, cursor: 1 });
  return data.map((repository) => ({
    name: repository.name,
    description: repository.description,
    stargazers_count: repository.stargazers_count,
    size: repository.size,
    language: repository.language,
    owner: repository.owner,
    period,
  }));
}
