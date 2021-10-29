FROM ubuntu:latest

RUN DEBIAN_FRONTEND=noninteractive apt update
RUN DEBIAN_FRONTEND=noninteractive apt install -y libsecret-1-dev curl
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o /usr/local/bin/n && chmod +x /usr/local/bin/n
RUN n v14
RUN apt install -y gnome-keyring dbus-x11

# Start the gnome keyring daemon when a bash session is initialized (requires passing --privileged when calling `docker run`)
RUN echo '[ -z "$GNOME_KEYRING_CONTROL" ] && eval $(echo letmein | gnome-keyring-daemon --unlock | sed -e "s/^/export /g")' > /root/.bashrc

COPY . /root/alks-cli

WORKDIR /root/alks-cli

# keytar has a postinstall script that builds a binary and that build process needs some basic permissions to run.
# When running `npm install` as root, npm switches to the `nobody` user (which has zero permissions) before executing 
# npm install scripts for security reasons to prevent install scripts from basically being able to run with root access. 
# This doesn't happen when running as any other user, so when running `npm install` as root you need to pass the 
# --unsafe-perm=true option to prevent npm from switching user to `nobody`. 
# 
# For the record, the permission that keytar needs is the ability to scan for a folder that it's supposed to create, so I 
# really hate that we have to do this for something so small but I could find no other way, aside from manually running
# `npm run build` inside the `node_modules/keytar` folder - Ben W.
RUN npm install --unsafe-perm=true . -g

# Start a dbus session and then run /bash/bash as the callback
ENTRYPOINT [ "dbus-run-session", "--", "/bin/bash" ]