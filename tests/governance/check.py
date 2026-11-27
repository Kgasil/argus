"""Static governance check. Not a release authorization or functional test."""
import json, pathlib, re, subprocess
root=pathlib.Path(__file__).resolve().parents[2]
baseline="f0e898d0b79bc40ac7cee79be2ec0c449e2bbde8"
def git(*args):
    return subprocess.check_output(["git",*args],cwd=root,text=True).strip()
gate=json.loads((root/"docs/quality/release-gates.json").read_text())
pins=gate["governance"]["actionPins"]
assert gate["decision"]=="NO_GO" and gate["releaseAuthorized"] is False and gate["globalScore"] is None
assert gate["verifiedChecks"]==703 and gate["minimumScore"]==9
assert [g["id"] for g in gate["gates"]]==["G01","G02","G03","G04","G05","G06","G07"]
assert sum(d["weight"] for d in gate["dimensions"])==100
print("ARGUS_GOVERNANCE_GATE NO_GO; 7 gates preserved")
count=0
for f in sorted((root/".github/workflows").glob("*.yml")):
    s=f.read_text()
    assert re.search(r"(?m)^permissions:\s*\n  contents: read\s*$",s),f.name
    for name,sha in re.findall(r"(?m)^\s*- uses:\s*([^@\s]+)@([^\s#]+)",s):
        assert re.fullmatch(r"[a-f0-9]{40}",sha) and pins.get(name)==sha,(f.name,name)
        count+=1
print("ARGUS_PINNED_ACTIONS",count)
changed=git("diff","--name-only",baseline,"HEAD").splitlines()
allowed={"SECURITY.md","extension/README.md","docs/quality/GOVERNANCE.md","docs/quality/release-gates.json","docs/quality/block-09-7-evidence.md","tests/governance/check.py"}
assert all(p.startswith(".github/workflows/") or p in allowed for p in changed),changed
print("ARGUS_RUNTIME_AND_FROZEN_UNCHANGED")
for name in ["SECURITY.md","extension/README.md"]:
    s=(root/name).read_text()
    assert "26/11/2026" in s and "parecer oficial permanece pendente" in s and "instalação permanece suspensa" in s
print("ARGUS_INCIDENT_DOCS_ALIGNED")
print("ARGUS_GOVERNANCE_PASS (static only; no release approval)")
