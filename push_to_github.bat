@echo off
echo =========================================
echo Pushing INKDROP code to GitHub...
echo =========================================

"C:\Program Files\Git\cmd\git.exe" add .
"C:\Program Files\Git\cmd\git.exe" commit -m "Auto-commit from batch file"

echo.
echo Uploading to GitHub... (A login window might pop up if you are not logged in!)
"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
echo =========================================
echo Done! Press any key to close this window.
echo =========================================
pause
