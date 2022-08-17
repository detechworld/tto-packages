## TTO packages

This repo contains all npm modules that are used on TTO

### How to create new npm package?

1. Create new package folder in packages
2. Init npm module by running command ```npm init --scope=@detechworld```
3. Add publish config to the package.json
   ```
   "publishConfig": {
       "registry": "https://npm.pkg.github.com"
    }
   ```

### How to publish new npm package or new version?

**Note:** Only manual publishing is supported for now❗

#### Before publishing:

1. Crate Github Personal Access Token:
   - Login to your Github account > Settings > Developer Settings > Personal access tokens
   - Scopes: write:packages
2. Login to npm.pkg.github.com
   ```
   npm login --scope=@detechworld --registry=https://npm.pkg.github.com
   ```

#### Publishing process:

1. Create commit according [Conversational Commits](https://www.conventionalcommits.org/en/v1.0.0/)
   - To publish minor version provide such commit message:
     ```
     feat(package-name): changes description
     ```
   - To publish patch version provide such commit message:
     ```
     fix(package-name): changes desciption
     ```
   - To publish major version provide such commit message:
     ```
     feat(package-name)!: changes desciption

     BREAKING CHANGE: describe breaking changes
     ```

2. Create new package version:
   ```
   npm run version
   ```
3. Publish new package version:
   ```
   npm run publish
   ```

### Possible improvements:

1. Add Conversational Commits validator (commitlint + hasky)
2. Add CI/CD process for auto-deployment (Github Actions + lerna)
