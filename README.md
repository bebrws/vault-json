A hack to recursively dump JSON data from vault using Vault CLI and NodeJS

On this line:
[cur.replace("/", "")]: getSettings(`${path}/${cur}`)

I ran into some issues. For some secrets it was missing the / in the path. I added this to fix that without wanting to spend time thinking about it