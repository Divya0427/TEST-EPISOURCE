# Production script
sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
sed -i.bak "s|$DEFAULT_LOCALHOST|$PROD_URL|g" manifest.xml
mkdir $RELEASE_VERSION
cp -r `ls -A | grep -v "$RELEASE_VERSION"` ./$RELEASE_VERSION
rm -rf !($RELEASE_VERSION)
