export default `post_install () {
    ln -sf /opt/nuclear/nuclear /usr/bin/nuclear
}

pre_upgrade ()  {
    rm -f /usr/bin/nuclear
}

post_upgrade () {
    ln -sf /opt/nuclear/nuclear /usr/bin/nuclear
}

post_remove ()  {
    rm -f /usr/bin/nuclear
}`;
