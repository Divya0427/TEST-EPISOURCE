find . | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/"
sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
sed -i.bak "s|$DEFAULT_LOCALHOST|$UAT_URL|g" manifest.xml
echo "PRINTING MANIFEST AT DEVELOP"
cat manifest.xml
mkdir uat && cd uat && mkdir $RELEASE_VERSION
cd ..
mv * .* ./uat/$RELEASE_VERSION