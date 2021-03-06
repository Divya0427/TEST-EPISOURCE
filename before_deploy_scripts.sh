# This script would be executed before deploy to S3
# If the travis merge branch is develop, then
    # updating the <Version> tag's value with the variable $RELEASE_VERSION and
    # replacing the default localhost URLs with the UAT URL in the manifest file.
    # After that, folders UAT/<version> would be created. Moving the entire files and folders from epicc-xl to this path epicc-xl/UAT/<version>/

if [[ ${TRAVIS_BRANCH} == "develop" && $TRAVIS_PULL_REQUEST != 1 ]]; then
    sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
    sed -i.bak "s|$DEFAULT_LOCALHOST|$UAT_URL|g" manifest.xml
    mkdir uat && cd uat && mkdir $RELEASE_VERSION
    cd ..
    mv * .* ./uat/$RELEASE_VERSION
fi


# If the travis merge branch is master, then
    # updating the <Version> tag's value with the variable $RELEASE_VERSION and
    # replacing the default localhost URLs with the Prod URL in the manifest file.
    # After that, folder /<version> would be created. Moving the entire files and folders from epicc-xl to this path epicc-xl/<version>/

if [[ ${TRAVIS_BRANCH} == "master" && $TRAVIS_PULL_REQUEST != 1 ]]; then
    sed "/Version/s/>[^<]*</>$RELEASE_VERSION</" manifest.xml
    sed -i.bak "s|$DEFAULT_LOCALHOST|$PROD_URL|g" manifest.xml
    mkdir /tmp/$RELEASE_VERSION
    mv ./.travis.yml /tmp/$RELEASE_VERSION
    mv .* /tmp/$RELEASE_VERSION
    cp -r .* /tmp/$RELEASE_VERSION
    cp -r * /tmp/$RELEASE_VERSION
    rm -rf *
    rm -rf .*
    cp -r /tmp/$RELEASE_VERSION .
    rm -rf /tmp/*
fi
