mkdir assets/bin
mkdir assets/bin/win64
mkdir assets/bin/linux64
mkdir assets/bin/osx
cd assets/bin/win64
wget https://github.com/pbca26/libnspv/releases/download/v0.3/nspv-win.tar
tar -xvzf nspv-win.tar
rm nspv-win.tar
cd ../linux64
wget https://github.com/pbca26/libnspv/releases/download/v0.3/nspv-linux.tar
tar -xvzf nspv-linux.tar
rm nspv-linux.tar
cd ../osx
wget https://github.com/pbca26/libnspv/releases/download/v0.3/nspv-osx.tar
tar -xvzf nspv-osx.tar
rm nspv-osx.tar