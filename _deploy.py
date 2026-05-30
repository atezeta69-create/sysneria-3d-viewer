import urllib.request, json, subprocess, os

TOKEN = "ghp_bI...gB"
REPO_NAME = "sysneria-3d-viewer"

# 1. Create repo
data = json.dumps({
    "name": REPO_NAME,
    "description": "Visor 3D web con model-viewer — Playa, Bosque, Mesa",
    "private": False,
    "auto_init": False
}).encode()

req = urllib.request.Request(
    "https://api.github.com/user/repos",
    data=data,
    headers={
        "Authorization": "Bearer " + TOKEN,
        "Content-Type": "application/json",
        "User-Agent": "Hermes-Agent"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read())
        print("✅ Repo creado:", d["full_name"])
        print("🌐 URL:", d["html_url"])
        
        # 2. Push local repo
        repo_url = d["clone_url"]
        authed_url = repo_url.replace("https://", "https://Atezeta:" + TOKEN + "@")
        
        os.chdir(r"C:\Users\Zeta\proyectos_blender\WEB_VIEWER")
        
        subprocess.run(["git", "remote", "add", "origin", authed_url],
                      capture_output=True, text=True, timeout=5)
        push = subprocess.run(["git", "push", "-u", "origin", "master"],
                            capture_output=True, text=True, timeout=120)
        
        print("Push stdout:", push.stdout)
        if push.stderr:
            print("Push stderr:", push.stderr[:500])
        
        if "fatal" not in push.stderr.lower():
            print("\n🎉 SUBIDO A GITHUB CON ÉXITO!")
            
            # 3. Enable GitHub Pages
            pages_data = json.dumps({
                "source": {"branch": "master", "path": "/"}
            }).encode()
            pages_req = urllib.request.Request(
                "https://api.github.com/repos/" + d["full_name"] + "/pages",
                data=pages_data,
                headers={
                    "Authorization": "Bearer " + TOKEN,
                    "Content-Type": "application/json",
                    "User-Agent": "Hermes-Agent"
                },
                method="POST"
            )
            try:
                with urllib.request.urlopen(pages_req) as pages_resp:
                    p = json.loads(pages_resp.read())
                    print("📡 Pages URL:", p.get("html_url", "generando..."))
            except urllib.error.HTTPError as e:
                if e.code == 409:
                    print("📡 Pages: configurado (tarda 1-2 min en activarse)")
                else:
                    print("📡 Pages:", e.code, "-", e.read().decode()[:200])
            
            print("\n🌍 URL final (en 1-2 min):")
            print("   https://atezeta69-create.github.io/" + REPO_NAME + "/")
        else:
            print("\n⚠️ Push falló. Comprobando...")
            # Try with different remote URL format
            subprocess.run(["git", "remote", "remove", "origin"], capture_output=True, text=True, timeout=5)
            alt_url = "https://" + TOKEN + "@github.com/atezeta69-create/" + REPO_NAME + ".git"
            subprocess.run(["git", "remote", "add", "origin", alt_url], capture_output=True, text=True, timeout=5)
            push2 = subprocess.run(["git", "push", "-u", "origin", "master"], capture_output=True, text=True, timeout=120)
            print("Push2 stdout:", push2.stdout)
            print("Push2 stderr:", push2.stderr[:500])
            
except urllib.error.HTTPError as e:
    print("❌ HTTP", e.code, ":", e.read().decode()[:300])
except Exception as e:
    print("❌ Error:", e)
