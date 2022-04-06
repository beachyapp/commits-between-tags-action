/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 320:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 202:
/***/ ((module) => {

module.exports = eval("require")("cross-fetch");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(320);
const fetch = __nccwpck_require__(202);

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

})();

module.exports = __webpack_exports__;
/******/ })()
;