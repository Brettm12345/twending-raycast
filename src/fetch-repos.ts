import { getPreferenceValues } from "@raycast/api";
import type { RepositoryResponse } from "./repository-response";

function subDays(date: Date, days: number) {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}
function subWeeks(date: Date, weeks: number) {
  return new Date(date.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
}
function subMonths(date: Date, months: number) {
  return new Date(date.getTime() - months * 30 * 24 * 60 * 60 * 1000);
}
function getPeriodFn(period: "daily" | "weekly" | "monthly") {
  switch (period) {
    case "daily":
      return subDays;
    case "weekly":
      return subWeeks;
    case "monthly":
      return subMonths;
  }
}
interface FetchReposInput {
  language: string;
  period: "daily" | "weekly" | "monthly";
  cursor: number;
}
export async function fetchRepos(input: FetchReposInput) {
  const preferences = getPreferenceValues<ExtensionPreferences>();
  const { githubToken } = preferences;
  const subDate = getPeriodFn(input.period);
  const startDate = subDate(new Date(), input.cursor);
  const endDate = subDate(new Date(), input.cursor + 1);
  const response = await fetch(
    `https://api.github.com/search/repositories?q=language:"${input.language}"+created:${startDate.toISOString()}..${endDate.toISOString()}&sort=stars&order=desc&per_page=30`,
    {
      headers: githubToken
        ? {
            Authorization: `Bearer ${githubToken}`,
          }
        : undefined,
    },
  );
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const data = (await response.json()) as RepositoryResponse;
  return {
    hasMore: data.incomplete_results,
    data: data.items,
    cursor: input.cursor + 1,
  };
}
