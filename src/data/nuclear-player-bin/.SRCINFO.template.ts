export default `pkgbase = nuclear-player-bin
	pkgdesc = A free, multiplatform music player app that streams from multiple sources.
	pkgver = {{pkgver}}
	pkgrel = 3
	url = http://nuclear.js.org
	install = nuclear-player-bin.install
	arch = x86_64
	license = GPL3
	depends = libnotify
	depends = libappindicator-gtk3
	depends = libxtst
	depends = nss
	provides = nuclear-player
	source = https://github.com/nukeop/nuclear/releases/download/v{{pkgver}}/nuclear-v{{pkgver}}.deb
	source = https://raw.githubusercontent.com/nukeop/nuclear/v{{pkgver}}/LICENSE
	sha256sums = {{debsha256}}
	sha256sums = SKIP

pkgname = nuclear-player-bin`;
