# This script would be executed before deploy to S3
# If the travis merge branch is develop, then
    # updating the <Version> tag's value with the variable $RELEASE_VERSION and
    # replacing the default localhost URLs with the UAT URL in the manifest file.
    # After that, folders UAT/<version> would be created. Moving the entire files and folders from epicc-xl to this path epicc-xl/UAT/<version>/

    # If the travis merge branch is master, then
    # updating the <Version> tag's value with the variable $RELEASE_VERSION and
    # replacing the default localhost URLs with the Prod URL in the manifest file.
    # After that, folder /<version> would be created. Moving the entire files and folders from epicc-xl to this path epicc-xl/<version>/
    # find . -maxdepth 1 | grep -v 1.1.0.0| xargs -i mv {} ./1.1.0.0
    # find * .* -maxdepth 1 | grep -v 1.1.0.0| xargs -i mv {} ./1.1.0.0
    # mkdir $RELEASE_VERSION
    # mv * .* ./$RELEASE_VERSION
    # condition: $TRAVIS_BRANCH =~ ^(master)$
    # cp -r `ls -A | grep -v "$RELEASE_VERSION"` ./$RELEASE_VERSION
    # rm -rf !$RELEASE_VERSION
if [[ ${TRAVIS_BRANCH} == "develop" && $TRAVIS_PULL_REQUEST != 1 ]]; then
    find . | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/"
    sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
    sed -i.bak "s|$DEFAULT_LOCALHOST|$UAT_URL|g" manifest.xml
    echo "PRINTING MANIFEST AT DEVELOP"
    cat manifest.xml
    mkdir uat && cd uat && mkdir $RELEASE_VERSION
    cd ..
    mv * .* ./uat/$RELEASE_VERSION
fi


if [[ ${TRAVIS_BRANCH} == "master" && $TRAVIS_PULL_REQUEST != 1 ]]; then
    echo ${TRAVIS_BRANCH}
    echo $TRAVIS_BRANCH
    find . | sed -e "s/[^-][^\/]*\// |/g" -e "s/|\([^ ]\)/|-\1/"
    sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
    sed -i.bak "s|$DEFAULT_LOCALHOST|$PROD_URL|g" manifest.xml
    echo "PRINTING MANIFEST AT master"
    cat manifest.xml
    mkdir /tmp/$RELEASE_VERSION
    mv .* /tmp/$RELEASE_VERSION
    cp -r .* /tmp/$RELEASE_VERSION
    cp -r * /tmp/$RELEASE_VERSION
    rm -rf *
    rm -rf .*
    cp -r /tmp/$RELEASE_VERSION .
    rm -rf /tmp/*
fi
