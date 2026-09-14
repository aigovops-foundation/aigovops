import re, urllib.request, urllib.parse, concurrent.futures as cf, ssl, html as H
ctx=ssl.create_default_context()
BASE="https://www.aigovops-foundation.com/"
pages=["index.html","community.html","blog/the-fall-2026-release.html","blog/es/the-fall-2026-release.html","blog.html","get-to-yes.html","stay-at-yes.html","recover-to-yes.html","f-ai-friday.html","feed.xml","founders.html","ecosystem.html","frameworks.html","events.html","support.html"]
def get(u):
    req=urllib.request.Request(u,headers={"User-Agent":"Mozilla/5.0 (site-check)"})
    try:
        with urllib.request.urlopen(req,timeout=20,context=ctx) as r: return r.status, r.read().decode('utf-8','ignore'), r.geturl()
    except urllib.error.HTTPError as e: return e.code,"",u
    except Exception as e: return str(e)[:50],"",u
links={}; bodies={}
for p in pages:
    st,body,fin=get(BASE+p); bodies[p]=body
    print(f"PAGE {p}: {st} {len(body)}B")
    for h in re.findall(r'href="([^"#]+)"',body):
        if h.startswith(('mailto:','javascript:','tel:','data:')): continue
        u=urllib.parse.urljoin(BASE+p,H.unescape(h)); links.setdefault(u,set()).add(p)
bad=[]
with cf.ThreadPoolExecutor(12) as ex:
    for u,(st,_,fin) in zip(sorted(links), ex.map(get, sorted(links))):
        if st!=200: bad.append((st,u,sorted(links[u])))
print("LINKS:",len(links)); print("BAD:")
for b in sorted(bad,key=str): print(" ",b)
# specific checks
c=bodies["community.html"]
print("practice section:", 'id="practice"' in c, "| worksheet links:", c.count("practice/blob/main/levels"))
i=bodies["index.html"]
print("index mentions practice repo:", "aigovops-foundation/practice" in i, "| index mentions 'Fall 2026':", "Fall 2026" in i)
s=bodies["blog/the-fall-2026-release.html"]
print("story title tag:", re.search(r"<title>([^<]*)",s).group(1)[:90])
print("story has og:image:", 'property="og:image"' in s, "| canonical:", 'rel="canonical"' in s, "| lang:", re.search(r'<html[^>]*lang="([^"]*)"',s).group(1))
es=bodies["blog/es/the-fall-2026-release.html"]
print("es page bytes:", len(es), "| es lang:", (re.search(r'<html[^>]*lang="([^"]*)"',es) or [None,None])[1], "| es first h1:", (re.search(r"<h1[^>]*>([^<]*)",es) or [None,"-"])[1][:80])
b=bodies["blog.html"]; print("blog index has fall card:", "the-fall-2026-release" in b)
f=bodies["feed.xml"]; print("feed has fall item:", "the-fall-2026-release" in f)
