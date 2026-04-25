@echo off
set GITHUB_TOKEN=
gh auth logout -h github.com
gh auth login -h github.com -p https -w
pause
