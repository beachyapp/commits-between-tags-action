# Diff between current and previous tag

This action returns commit messages between two tags. Usually triggered after you create a new tag.

## Inputs

## `owner`

**Required** Name of the owner or organization name of the repository 

## `repo`

**Required** The repo that contains the tags

## `github-token`

**Required** Github token to access to fetch tags

## Example usage

```
on:
  push:
    tags:
      - '*'

jobs:
  get-commit-diff:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repo
        uses: actions/checkout@v3
      - name: Get commits 
        id: diff
        uses: actions/commits-between-tags-action@v0.2
        with:
          owner: 'my-org'
          repo: 'my-repo'
          github-token: ${{ secrets.GITHUB_TOKEN }}
      # Use the output from the `hello` step
      - name: Get the output 'commits'
        run: echo "The time was ${{ steps.diff.outputs.commits }}"
```
