#!/bin/bash
# 复制云函数到 uni-app 编译输出目录
# 注意：目标目录若已存在，cp -R 会将源目录复制到其内部导致嵌套，
# 因此先删除目标目录再复制，确保完全替换。
echo "Copying cloud functions..."

if [ -d "unpackage/dist/dev/mp-weixin" ]; then
    rm -rf unpackage/dist/dev/mp-weixin/cloudfunctions
    cp -R cloudfunctions unpackage/dist/dev/mp-weixin/cloudfunctions
    echo "✅ Copied to dev/mp-weixin"
fi

if [ -d "unpackage/dist/build/mp-weixin" ]; then
    rm -rf unpackage/dist/build/mp-weixin/cloudfunctions
    cp -R cloudfunctions unpackage/dist/build/mp-weixin/cloudfunctions
    echo "✅ Copied to build/mp-weixin"
fi

echo "Done!"
