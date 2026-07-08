@echo off
echo Staging all changes...
git add .

echo Committing...
git commit -m "Auto commit from script"

echo Pushing to GitHub...
git push origin main

echo.
echo All done! Your code has been synced to GitHub.
pause
