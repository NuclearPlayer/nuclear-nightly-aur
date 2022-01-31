export default `pkgbase = nuclear-player-bin
pkgdesc = A free, multiplatform music player app that streams from multiple sources.
pkgver = {{pkgver}}
pkgrel = 2
url = http://nuclear.js.org
install = nuclear-player-bin.install
arch = x86_64
license = AGPL-3.0
depends = libnotify
depends = libappindicator-gtk3
depends = libxtst
depends = nss
source = {{deburl}}
source = nuclear.desktop
md5sums = {{debmd5}}
md5sums = {{desktopmd5}}

pkgname = nuclear-player-bin

`;
