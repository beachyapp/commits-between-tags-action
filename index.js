const core = require('@actions/core');
const fetch = require("cross-fetch");

try {
  const owner = core.getInput('owner');
  const repo = core.getInput('repo');
  const githubToken = core.getInput('github-token');
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const getTagsQuery = `query {
    repository(owner: "${owner}", name: "${repo}") {
      refs(refPrefix: "refs/tags/", last: 2, orderBy: {field: TAG_COMMIT_DATE, direction: ASC}) {
        edges { node { name } }
      }
    }
  }`;
  const options = {
    method: "POST",
    headers: {
      "Authorization": `token ${githubToken}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json"
    }
  };

  // get last two tags
  fetch(`https://api.github.com/graphql`, {
    ...options,
    body: JSON.stringify({ query: getTagsQuery })
  })
  .then(res => res.json())
  .then(data => {
    const nodes = data.data.repository.refs.edges;
    return {
      previous:nodes[0].node.name, 
      latest: nodes[1].node.name
    };
  })
  .then(tags => {
    // compare the last two tags
    const compareURL = `${url}/compare/${tags.previous}...${tags.latest}`;
    console.info(compareURL);
    fetch(`${compareURL}`, {
      ...options, 
      method: 'GET'
    })
    .then(res => res.json())
    // get only the commit messages
    .then(diff => diff.commits.map(element => element.commit.message))
    // join the array, to get one string
    .then(commitsArray => commitsArray.join(' '))
    // set it in output
    .then(commits => {
      console.info("commits=", commits);
      core.setOutput("commits", commits)
    });
  })
} catch (error) {
  core.setFailed(error.message);
}
