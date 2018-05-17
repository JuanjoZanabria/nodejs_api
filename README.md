add # nodejs_api

Documentation about NodeJS API for GAP.

## Github Commands

### Installing
```
  git init
  git remote add upstream https://github.com/JuanjoZanabria/nodejs_api.git
  git remote add origin https://github.com/JuanjoZanabria o camps88/nodejs_api.git
  git remote -v
```
### Branchs
* **master**
```
Stable version
```
* **develop**
```
Testing
```

### Updating repository
Run this commands in order to apply changes:
* Check branch
```
  git checkout master or develop
```
* Update **local** from **[upstream](https://github.com/JuanjoZanabria/nodejs_api.git)**
```
  git pull upstream master
```
* Push new files
```
  git add nombrefichero
  git commit -m comentario (commitN-Fecha-Autor-Descripcion)
  git push origin master (actualiza ORIGIN desde Local)
  git push upstream master (actualiza UPSTREAM desde Local)
```
* Push only deleted or modified files
```
  git add -u
  git commit -a
  git push origin master (actualiza ORIGIN desde Local)
  git push upstream master (actualiza UPSTREAM desde Local)
```
* Merge and fetch commands
```
  git merge upstream/master
  git fetch upstream
```

More details at [atlassian](https://www.atlassian.com/git?utm_source=basic-git-commands&utm_medium=link&utm_campaign=git-microsite)

## API in NodeJS

Developing....
