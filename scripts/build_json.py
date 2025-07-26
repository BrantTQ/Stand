import json, pathlib
pathlib.Path("src/data").mkdir(parents=True, exist_ok=True)

life_stages = [
    {"id":"early","title":"Early Childhood", "icon":"👶", "domains":["family","education"], "blurbs":["early_demo"]},
    {"id":"primary","title":"Primary Education", "icon":"🎒", "domains":["education"], "blurbs":[]},
    {"id":"secondary","title":"Secondary Education", "icon":"📚", "domains":["education"], "blurbs":[]},
    {"id":"tertiary","title":"Tertiary Education", "icon":"🎓", "domains":["education"], "blurbs":[]},
    {"id":"adult","title":"Adult Life", "icon":"💼", "domains":["work","family"], "blurbs":[]},
    {"id":"senior","title":"Senior Life", "icon":"👴", "domains":["health","leisure"], "blurbs":[]},
]

blurbs = {
    "early_demo": {"stage":"early","domain":"family","title":"Demo blurb","text":"Synthetic paragraph for early childhood..."},
}

graph = {
    "nodes":[
        {"id":"s1","label":"Childcare enrolment","stage":"early","domain":"family"},
        {"id":"s2","label":"Maths score","stage":"primary","domain":"education"}
    ],
    "edges":[{"source":"s1","target":"s2","type":"correlation"}]
}

json.dump(life_stages, open("src/data/lifeStages.json","w"), indent=2)
json.dump(blurbs,      open("src/data/blurbs.json","w"), indent=2)
json.dump(graph,       open("src/data/graph.json","w"), indent=2)
print("Synthetic data written.")
