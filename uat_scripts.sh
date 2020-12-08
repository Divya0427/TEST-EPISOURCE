# UAT script
sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
sed -i.bak "s|$DEFAULT_LOCALHOST|$UAT_URL|g" manifest.xml
mkdir uat && cd uat && mkdir $RELEASE_VERSION && cd ..
cp -r `ls -A | grep -v "uat"` ./uat/$RELEASE_VERSION
rm -rf !uat
