# This script would be executed before deploy to S3
# If the travis merge branch is develop, then
    # updating the <Version> tag's value with the variable $RELEASE_VERSION and
    # replacing the default localhost URLs with the UAT URL in the manifest file.
    # After that, folders UAT/<version> would be created. Moving the entire files and folders from epicc-xl to this path epicc-xl/UAT/<version>/
if [[ ${TRAVIS_BRANCH} == "develop" && $TRAVIS_PULL_REQUEST != 1 ]]; then
    echo "============PRINTING MANIFEST AT DEVELOP"
    find . | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/"
    sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
    sed -i.bak "s|$DEFAULT_LOCALHOST|$UAT_URL|g" manifest.xml
    echo "PRINTING MANIFEST AT DEVELOP"
    cat manifest.xml
    mkdir uat && cd uat && mkdir $RELEASE_VERSION
    cd ..
    mv * .* ./uat/$RELEASE_VERSION
fi
# If the travis merge branch is master, then
    # updating the <Version> tag's value with the variable $RELEASE_VERSION and
    # replacing the default localhost URLs with the Prod URL in the manifest file.
    # After that, folder /<version> would be created. Moving the entire files and folders from epicc-xl to this path epicc-xl/<version>/
    # find . -maxdepth 1 | grep -v 1.1.0.0| xargs -i mv {} ./1.1.0.0
    # find * .* -maxdepth 1 | grep -v 1.1.0.0| xargs -i mv {} ./1.1.0.0
if [[ ${TRAVIS_BRANCH} == "new-master" && $TRAVIS_PULL_REQUEST != 1 ]]; then
    find . | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/"
    sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
    sed -i.bak "s|$DEFAULT_LOCALHOST|$PROD_URL|g" manifest.xml
    echo "PRINTING MANIFEST AT MASTER"
    cat manifest.xml
    mkdir $RELEASE_VERSION
    find . | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/"
    mv * .* ./$RELEASE_VERSION
fi

