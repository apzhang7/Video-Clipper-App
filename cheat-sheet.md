# GIT START
add more if you think its important

* get repo into local system
```
git clone (link or ssh)
```
---

# BRANCH

* look at which branch you are in
```
git branch
```

* go to branch
```
git checkout branch_name
```

* go to branch and "-b" will make new one if it does not exist
```
git checkout -b new_branch_name
```
---

# USUAL USES FOR CODING (ALWAYS DO THIS)

* gets the most recent files/updates files in that repo
```
git pull
```

* adds files that are saved and have changes (. means ALL)
```
git add . 
git add file_name
```

* commits the files to be pushed + adds message
```
git commit -m "(title/brief description of what you coded)"
```

* push
```
git push origin branch_name
```

---

# SPECIAL CASES

* hard delete your branch
```
git branch -D branch_name
```

* hard reset to what is on github main branch
```
git checkout main
git fetch origin 
git reset --hard origin/main
```

---

# NPM + PNPM + WEBSITE

* downloads pnpm which we need
```
npm install -g pnpm
```

* allows the use of ffmpeg
```
pnpm install @ffmpeg/ffmpeg @ffmpeg/core
```

* IMPORTANT: the next commands have to be in nextjs-dashboard
```
cd nextjs-dashboard
```

* initialize 
```
pnpm i
```

* deploy the website
```
pnpm dev
```