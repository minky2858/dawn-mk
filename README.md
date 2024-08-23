# Dawn Validator

DAWN website: https://www.dawninternet.com
DAWN Twitter: https://twitter.com/dawninternet
DAWN Telegram: https://t.me/+KbNPWHXb2n5iNTIx

## Setup

Download the extension [here](https://chromewebstore.google.com/detail/dawn-validator-chrome-ext/fpdkjdnhkakefebpekbdhillbhonfjjp) then follow the instructions to create an account. Feel free to use my referal: `4mdyjjvy`.

Then start the container:

```bash
docker run \
    --restart=always \
    -d \
    --name dawn \
    -e DAWN_USERNAME='<your username>' \
    -e DAWN_PASSWORD='<your password>' \
    -e DAWN_PROXY='OPTINAL <host>:<port>:<user>:<pass>' \
    ghcr.io/minky2858/dawn-mk:latest

# or build it
git clone https://github.com/minky2858/dawn-mk
cd dawn-mk

docker build -t dawn-mk . --no-cache
docker run \
    --restart=always \
    -d \
    --name dawn \
    -e DAWN_USERNAME='<your username>' \
    -e DAWN_PASSWORD='<your password>' \
    -e DAWN_PROXY='OPTINAL <host>:<port>:<user>:<pass>' \
    dawn-mk
```

Alternatively, you can edit `docker-compose.yml` then run:

```bash
docker-compose up -d
```

Yes, there are some other implementations by others to keep the connection _keepalive_ via the API. Feel free to use those, I personally prefer simulating a browser due to various reasons.
