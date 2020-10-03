## Installing Node.JS required version:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source "$HOME/.bashrc"
nvm --version
nvm install 12
nvm alias default 12
node --version
npm --version
```

## Installing pinbank CLI

```bash
npm install -g pinbank-cli
```

## .env file example:

```
CHANNEL_CODE=
CLIENT_CODE=
USER_NAME=
KEY_VALUE=
REQUEST_ORIGIN=
```

## Request example:

```
pibank -e .env -r CashIn.ConsultarBoleto -p NossoNumero=00/00000000000-0
```
