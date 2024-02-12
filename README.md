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

## Compiling and pushing changes

Checking in your node_modules directory can cause problems. As an alternative, you can use a tool called @vercel/ncc to compile your code and modules into one file used for distribution.

Install vercel/ncc by running this command in your terminal.

`npm i -g @vercel/ncc`

Compile your index.js file.

`ncc build index.js --license licenses.txt`

You'll see a new dist/index.js file with your code and the compiled modules. You will also see an accompanying dist/licenses.txt file containing all the licenses of the node_modules you are using.

Change the main keyword in your action.yml file to use the new dist/index.js file.

`main: 'dist/index.js'`

If you already checked in your node_modules directory, remove it.

`rm -rf node_modules/*`

From your terminal, commit the updates to your action.yml, dist/index.js, and node_modules files.

```shell
git add action.yml dist/index.js node_modules/*
git commit -m "Use vercel/ncc"
git tag -a -m "My first action release" v1.1
git push --follow-tags
```
