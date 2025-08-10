import json, pathlib
pathlib.Path("src/data").mkdir(parents=True, exist_ok=True)

life_stages = [
    {"id": "early", "title": "Early Childhood", "icon": "👶", "domains": ["family", "education"], "blurbs": ["early_demo"], "color": "#2a2986", "metrics": []},
    {"id": "childhood", "title": "Childhood", "icon": "🧒", "domains": ["education", "family"], "blurbs": [], "color": "#2a2986", "metrics": []},
    {"id": "tertiary", "title": "Tertiary Education", "icon": "🎓", "domains": ["education", "work", "family"], "blurbs": [], "color": "#2a2986", "metrics": []},
    {"id": "adult", "title": "Adult Life", "icon": "💼", "domains": ["family", "work", "health"], "blurbs": [], "color": "#2a2986", "metrics": []},
    {"id": "senior", "title": "Senior Life", "icon": "👴", "domains": ["leisure", "health", "family"], "blurbs": [], "color": "#2a2986", "metrics": []},
    {"id": "ai_future", "title": "AI and the Future", "icon": "🤖", "domains": ["work", "education", "health"], "blurbs": [], "color": "#2a2986", "metrics": []},
]

blurbs = {
    "early_demo": {"stage": "early", "domain": "family", "title": "Demo blurb", "text": "Synthetic paragraph for early childhood..."},
}

graph = {
    "nodes": [
        {"id": "s1", "label": "Childcare enrolment", "stage": "early", "domain": "family"},
        {"id": "s2", "label": "Maths score", "stage": "childhood", "domain": "education"},
        {"id": "s3", "label": "AI literacy", "stage": "ai_future", "domain": "education"},
    ],
    "edges": [
        {"source": "s1", "target": "s2", "type": "correlation"},
        {"source": "s2", "target": "s3", "type": "trend"}
    ]
}

json.dump(life_stages, open("src/data/lifeStages.json", "w"), indent=2, ensure_ascii=False)
json.dump(blurbs, open("src/data/blurbs.json", "w"), indent=2, ensure_ascii=False)
json.dump(graph, open("src/data/graph.json", "w"), indent=2, ensure_ascii=False)
print("Synthetic data written.")
