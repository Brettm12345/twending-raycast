import { fetchRepos } from "../fetch-repos";
import type { Repository } from "../repository-response";

type ReponsitoryToolResult = Pick<
  Repository,
  "name" | "description" | "stargazers_count" | "size" | "language" | "owner"
> & {
  period: "daily" | "weekly" | "monthly";
};
type Input = {
  language: string;
  period: "daily" | "weekly" | "monthly";
};
export default async function viewTrendingRepositories(input: Input): Promise<ReponsitoryToolResult[]> {
  const { language, period } = input;
  const { data } = await fetchRepos({ language, period, cursor: 1 });
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
