export type HumanSize = {
  size: string
  unit: string
}

export type RepoInfo = {
  owner: string
  name: string
}

export type PartialGitHubRepo = {
  data: {
    repository: {
      diskUsage: number
    }
  }
}

export type PartialGitHubRepoRestV3 = {
  size: number
}
