@echo off
REM 复制云函数到 uni-app 编译输出目录
echo Copying cloud functions...

if exist "unpackage\dist\dev\mp-weixin" (
    xcopy /E /I /Y "cloudfunctions" "unpackage\dist\dev\mp-weixin\cloudfunctions"
    echo ✅ Copied to dev\mp-weixin
)

if exist "unpackage\dist\build\mp-weixin" (
    xcopy /E /I /Y "cloudfunctions" "unpackage\dist\build\mp-weixin\cloudfunctions"
    echo ✅ Copied to build\mp-weixin
)

echo Done!
pause
