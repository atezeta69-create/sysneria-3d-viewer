import urllib.request, json, subprocess, os, sys

# === CONFIG ===
TOKEN = sys.argv[1]
USER  = "atezeta69-create"
REPO  = "sysneria-3d-viewer"

# 1. Verify token first
print("1. Verificando token...")
req = urllib.request.Request("https://api.github.com/user", headers={"Authorization": "Bearer " + TOKEN, "User-Agent": "H"})
resp = urllib.request.urlopen(req)
d = json.loads(resp.read())
user = d.get("login")
print(f"   Token OK! Usuario: {user}")

# 2. Create repo
print("2. Creando repo...")
data = json.dumps({"name": REPO, "description": "Visor 3D web con model-viewer", "private": False, "auto_init": False}).encode()
req = urllib.request.Request("https://api.github.com/user/repos", data=data, headers={"Authorization": "Bearer " + TOKEN, "Content-Type": "application/json", "User-Agent": "H"}, method="POST")
try:
    resp = urllib.request.urlopen(req)
    d = json.loads(resp.read())
    print(f"   Repo creado: {d['full_name']}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    if "already exists" in body:
        print("   Repo ya existe, continuando...")
    else:
        print(f"   Error {e.code}: {body[:200]}")
        sys.exit(1)

# 3. Push to GitHub
print("3. Subiendo a GitHub...")
os.chdir(r"C:\Users\Zeta\proyectos_blender\WEB_VIEWER")
subprocess.run(["git", "remote", "remove", "origin"], capture_output=True, text=True, timeout=5)
auth_url = f"https://{USER}:{TOKEN}@github.com/{USER}/{REPO}.git"
subprocess.run(["git", "remote", "add", "origin", auth_url], capture_output=True, text=True, timeout=5)
push = subprocess.run(["git", "push", "-u", "origin", "master"], capture_output=True, text=True, timeout=300)
if push.returncode == 0:
    print("   ✅ Push completado!")
else:
    print(f"   ⚠️ Push con código {push.returncode}:")
    print(f"   {push.stderr.decode() if isinstance(push.stderr, bytes) else push.stderr}")
    sys.exit(1)

# 4. Enable GitHub Pages
print("4. Activando GitHub Pages...")
pdata = json.dumps({"source": {"branch": "master", "path": "/"}}).encode()
preq = urllib.request.Request(f"https://api.github.com/repos/{USER}/{REPO}/pages", data=pdata, headers={"Authorization": "Bearer " + TOKEN, "Content-Type": "application/json", "User-Agent": "H"}, method="POST")
try:
    resp = urllib.request.urlopen(preq)
    p = json.loads(resp.read())
    print(f"   Pages URL: {p.get('html_url', 'OK')}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"   Pages: {e.code} - {body[:200]}")

URL = f"https://{USER}.github.io/{REPO}/"
print(f"\n{'='*50}")
print(f"🎉 VISOR ONLINE!")
print(f"{'='*50}")
print(f"🌍 {URL}")
print(f"   (tarda ~1-2 min en estar disponible)")
print(f"{'='*50}")
