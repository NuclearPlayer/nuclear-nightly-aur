export default `# Maintainer: nukeop <nuclear at gumblert dot tech>
pkgname=nuclear-player-bin
pkgver={{pkgver}}
repurl=https://github.com/nukeop/nuclear
commidfull=$(git ls-remote $repurl.git -tags v$pkgver)
commid=\${commidfull:0:6}
pkgrel=2
epoch={{epoch}}
pkgdesc="A free, multiplatform music player app that streams from multiple sources."
arch=('x86_64')
url="http://nuclear.js.org/"
install=nuclear-player-bin.install
license=('GPL3')
depends=('libnotify' 'libappindicator-gtk3' 'libxtst' 'nss' )
source=(
    {{deburl}}
    nuclear.desktop
)
md5sums=('{{debmd5}}'
         '{{desktopmd5}}')

package()   {
    tar xf data.tar.xz

    cp --preserve=mode -r usr "\${pkgdir}"
    cp --preserve=mode -r opt "\${pkgdir}"

    find "\${pkgdir}" -type d -exec chmod 755 {} +

    cp --preserve=mode \${srcdir}/nuclear.desktop \${pkgdir}/usr/share/applications
}`;

