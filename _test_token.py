import urllib.request, json

# Read token
with open("/tmp/gh_token.txt") as f:
    token = f.read().strip()

# Test
req = urllib.request.Request(
    "https://api.github.com/user",
    headers={
        "Authorization": "Bearer " + token,
        "User-Agent": "Hermes-Agent"
    }
)
with urllib.request.urlopen(req) as resp:
    d = json.loads(resp.read())
    print("OK:", d.get("login"))
