@echo off
title Push Chess Quest to GitHub
echo ======================================================
echo Pushing Chess Quest to:
echo https://github.com/harishfoviz-afk/Chessquest
echo ======================================================
echo.
"%LOCALAPPDATA%\MinGit\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ======================================================
    echo SUCCESS! Your code has been pushed to GitHub!
    echo Now enable GitHub Pages in your repo settings:
    echo https://github.com/harishfoviz-afk/Chessquest/settings/pages
    echo ======================================================
) else (
    echo If GitHub asked for authentication, please sign in or use a Personal Access Token.
)
pause
