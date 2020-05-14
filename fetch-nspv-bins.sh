mkdir assets/bin
mkdir assets/bin/win64
mkdir assets/bin/linux64
mkdir assets/bin/osx
cd assets/bin/win64
wget https://github.com/SirSevenG/libnspv/releases/download/6/nspv-win-b79916e94095ff1dcdfd608cf8a2071f52d42893.zip
unzip nspv-win-b79916e94095ff1dcdfd608cf8a2071f52d42893.zip
rm nspv-win-b79916e94095ff1dcdfd608cf8a2071f52d42893.zip
cd ../linux64
wget https://github.com/SirSevenG/libnspv/releases/download/6/nspv-linux-b79916e94095ff1dcdfd608cf8a2071f52d42893.tar.gz
tar -xvzf nspv-linux-b79916e94095ff1dcdfd608cf8a2071f52d42893.tar.gz
rm nspv-linux-b79916e94095ff1dcdfd608cf8a2071f52d42893.tar.gz
cd ../osx
wget https://github.com/SirSevenG/libnspv/releases/download/6/nspv-macos-b79916e94095ff1dcdfd608cf8a2071f52d42893.tar.gz
tar -xvzf nspv-macos-b79916e94095ff1dcdfd608cf8a2071f52d42893.tar.gz
rm nspv-macos-b79916e94095ff1dcdfd608cf8a2071f52d42893.tar.gz