echo ${TRAVIS_BRANCH}
echo $TRAVIS_BRANCH
find . | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/"
sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
sed -i.bak "s|$DEFAULT_LOCALHOST|$PROD_URL|g" manifest.xml
echo "PRINTING MANIFEST AT MASTER"
cat manifest.xml
mkdir $RELEASE_VERSION
cp -r `ls -A | grep -v "$RELEASE_VERSION"` ./$RELEASE_VERSION