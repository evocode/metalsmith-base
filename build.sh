#
# Build script - It will setup a git repository in the build directory.
#

REPO=$1
HERE=$(pwd)
#TMP_FOLDER=$(mktemp -d)
TMP_FOLDER=.tmp

if [ -z "$REPO" ]; then
  REPO=$(cat .buildrepo)
fi

if [ -z "$REPO" ]; then
  echo "GIT REPO required"
  exit 1
fi

mkdir $TMP_FOLDER
cd $TMP_FOLDER
git init
git remote add origin $REPO
git fetch
git checkout master
cd $HERE
mv $TMP_FOLDER/.git build/.git
rm -rf $TMP_FOLDER
