import { Action, ActionPanel, getPreferenceValues, Icon, Image, List, Toast, useNavigation } from "@raycast/api";
import { showFailureToast, useCachedPromise } from "@raycast/utils";
import { useState } from "react";
import { fetchRepos } from "./fetch-repos";
import { languages } from "./languages";
import type { Repository } from "./repository-response";

interface ViewTrendingRepositoriesProps {
  language: string;
}
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
export function ViewTrendingRepositories(props: ViewTrendingRepositoriesProps) {
  const { language } = props;
  const preferences = getPreferenceValues<ExtensionPreferences>();
  const [period, setPeriod] = useState(preferences.defaultPeriod ?? "weekly");
  const { isLoading, data } = useCachedPromise(
    ({ cursor, period }) => fetchRepos({ language, period, cursor }),
    [
      {
        cursor: 1,
        period,
      },
    ],
    {
      onError: (error) => {
        showFailureToast({ title: "Error", message: error.message, style: Toast.Style.Failure });
      },
    },
  );
  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Period"
          onChange={(value) => setPeriod(value as "daily" | "weekly" | "monthly")}
          value={period}
        >
          <List.Dropdown.Item value="daily" title="Daily" />
          <List.Dropdown.Item value="weekly" title="Weekly" />
          <List.Dropdown.Item value="monthly" title="Monthly" />
        </List.Dropdown>
      }
      searchBarPlaceholder="Search repositories"
    >
      {data?.data?.map((repository: Repository) => (
        <List.Item
          key={repository.id}
          icon={{ source: repository.owner.avatar_url, mask: Image.Mask.RoundedRectangle }}
          title={repository.name}
          subtitle={repository.description}
          accessories={[
            { text: repository.language, icon: Icon.Code },
            { text: dateFormatter.format(new Date(repository.created_at)), icon: Icon.Calendar },
            { text: `${repository.stargazers_count} stars`, icon: Icon.Star },
            { text: `${repository.size} KB`, icon: Icon.Document },
          ]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={repository.html_url} shortcut={{ key: "v", modifiers: ["cmd"] }} />
              <Action.OpenInBrowser
                title="View Owner"
                url={repository.owner.html_url}
                shortcut={{ key: "o", modifiers: ["cmd"] }}
              />
              <Action.CopyToClipboard
                title="Copy Repository URL"
                content={repository.html_url}
                shortcut={{ key: "c", modifiers: ["cmd"] }}
              />
              <Action.CopyToClipboard
                title="Copy Repository Name"
                content={repository.name}
                shortcut={{ key: "n", modifiers: ["cmd"] }}
              />
              <Action.CopyToClipboard
                title="Copy Author/Repository"
                content={`${repository.owner.login}/${repository.name}`}
                shortcut={{ key: "d", modifiers: ["cmd"] }}
              />
              <Action.CopyToClipboard
                title="Copy Author"
                content={repository.owner.login}
                shortcut={{ key: "a", modifiers: ["cmd"] }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

export default function Command() {
  const { push } = useNavigation();
  return (
    <List>
      <List.Item
        title="All Languages"
        actions={
          <ActionPanel>
            <Action
              title="View Trending Repositories"
              onAction={() => push(<ViewTrendingRepositories language="All Languages" />)}
            />
          </ActionPanel>
        }
      />
      <List.Section title="Popular Languages">
        {languages.popular.map((language) => (
          <List.Item
            key={language}
            title={language}
            actions={
              <ActionPanel>
                <Action
                  title="View Trending Repositories"
                  onAction={() => push(<ViewTrendingRepositories language={language} />)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
      <List.Section title="Other Languages">
        {languages.everythingElse.map((language) => (
          <List.Item
            key={language}
            title={language}
            actions={
              <ActionPanel>
                <Action
                  title="View Trending Repositories"
                  onAction={() => push(<ViewTrendingRepositories language={language} />)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
