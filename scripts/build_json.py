import json, pathlib
pathlib.Path("src/data").mkdir(parents=True, exist_ok=True)

life_stages = [
  {
    "id": "early",
    "title": "Early Childhood",
    "icon": "/children.gif",
    "domains": ["family", "education"],
    "blurbs": ["early_demo"],
    "color": "#2a2986",
    "metrics": []
  },
  {
    "id": "school",
    "title": "School Age",
    "icon": "/education.gif",
    "domains": ["education", "work", "family"],
    "blurbs": [],
    "color": "#2a2986",
    "metrics": []
  },
  {
    "id": "adult",
    "title": "Adult Life",
    "icon": "/couple.gif",
    "domains": ["family", "work", "health"],
    "blurbs": [],
    "color": "#2a2986",
    "metrics": []
  },
  {
    "id": "senior",
    "title": "Senior Life",
    "icon": "/senior.gif",
    "domains": ["leisure", "health", "family"],
    "blurbs": [],
    "color": "#2a2986",
    "metrics": []
  },
  {
    "id": "ai_future",
    "title": "AI and the Future",
    "icon": "/ai.gif",
    "domains": ["technology", "education", "work"],
    "blurbs": [],
    "color": "#2a2986",
    "metrics": []
  }
]

blurbs = {
  "childhood": {
    "stage": "early",
    "domains": {
      "family": {
        "projects": [
          {
            "title": "Early Childhood Overview",
            "introduction": "Synthetic introduction for early childhood focusing on family environment and early development.",
            "conclusion": "Key takeaway: stable family support correlates with improved early outcomes.",
            "image": {
                      "src": "/energy_pooled.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": "/qr_codes/early_childhood_overview.png",
            "author": "John Doe"
          },
          {
            "title": "Family Support Case Study",
            "introduction": "Short case study describing targeted support for families with young children.",
            "conclusion": "Case indicates targeted guidance can raise developmental indicators.",
            "image": {
                "src": "/energy_pooled.png",
                "cite": "https://liser.lu"
            },
            "qrCode": "/qr_codes/family_support_case_study.png",
            "author": "Jane Smith"
        }
      ]
      },
      "education": {
          "projects": [
              {
                "title": "Early Childhood Education",
                "introduction": "Overview of early childhood education programs and their impact.",
                "conclusion": "Investing in early education yields long-term benefits.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/early_childhood_education.png",
                "author": "John Doe"
              },
              {
                "title": "Child Development Metrics",
                "introduction": "Summary of key metrics used to assess child development in early years.",
                "conclusion": "Regular assessments help track progress and identify needs.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/child_development_metrics.png",
                "author": "Jane Smith"
              }
          ]
      }
  }},
  "school": {
    "stage": "school",
    "domain": {
      "family": {
        "projects": [
          {
            "title": "Early Childhood Overview",
            "introduction": "Synthetic introduction for early childhood focusing on family environment and early development.",
            "conclusion": "Key takeaway: stable family support correlates with improved early outcomes.",
            "image": {
                      "src": "/energy_pooled.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": "/qr_codes/early_childhood_overview.png",
            "author": "John Doe"
          },
          {
            "title": "Family Support Case Study",
            "introduction": "Short case study describing targeted support for families with young children.",
            "conclusion": "Case indicates targeted guidance can raise developmental indicators.",
            "image": {
                "src": "/energy_pooled.png",
                "cite": "https://liser.lu"
            },
            "qrCode": "/qr_codes/family_support_case_study.png",
            "author": "Jane Smith"
          }
        ]
      },
      "education": {
          "projects": [
              {
                "title": "Early Childhood Education",
                "introduction": "Overview of early childhood education programs and their impact.",
                "conclusion": "Investing in early education yields long-term benefits.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/early_childhood_education.png",
                "author": "John Doe"
              },
              {
                "title": "Child Development Metrics",
                "introduction": "Summary of key metrics used to assess child development in early years.",
                "conclusion": "Regular assessments help track progress and identify needs.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/child_development_metrics.png",
                "author": "Jane Smith"
              }
          ]
      }
    }
  },
  "adult": {
    "stage": "adult",
    "domains": {
      "family": {
        "projects": [
          {
            "title": "Early Childhood Overview",
            "introduction": "Synthetic introduction for early childhood focusing on family environment and early development.",
            "conclusion": "Key takeaway: stable family support correlates with improved early outcomes.",
            "image": {
                      "src": "/energy_pooled.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": "/qr_codes/early_childhood_overview.png",
            "author": "John Doe"
          },
          {
            "title": "Family Support Case Study",
            "introduction": "Short case study describing targeted support for families with young children.",
            "conclusion": "Case indicates targeted guidance can raise developmental indicators.",
            "image": {
                "src": "/energy_pooled.png",
                "cite": "https://liser.lu"
            },
            "qrCode": "/qr_codes/family_support_case_study.png",
            "author": "Jane Smith"
          }
        ]
      },
      "education": {
          "projects": [
              {
                "title": "Early Childhood Education",
                "introduction": "Overview of early childhood education programs and their impact.",
                "conclusion": "Investing in early education yields long-term benefits.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/early_childhood_education.png",
                "author": "John Doe"
              },
              {
                "title": "Child Development Metrics",
                "introduction": "Summary of key metrics used to assess child development in early years.",
                "conclusion": "Regular assessments help track progress and identify needs.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/child_development_metrics.png",
                "author": "Jane Smith"
              }
            ]
          }
    }
  },
  "senior": {
    "stage": "senior", 
    "domains": {
      "leisure": {
        "projects": [
          {
            "title": "Early Childhood Overview",
            "introduction": "Synthetic introduction for early childhood focusing on family environment and early development.",
            "conclusion": "Key takeaway: stable family support correlates with improved early outcomes.",
            "image": {
                      "src": "/energy_pooled.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": "/qr_codes/early_childhood_overview.png",
            "author": "John Doe"
          },
          {
            "title": "Family Support Case Study",
            "introduction": "Short case study describing targeted support for families with young children.",
            "conclusion": "Case indicates targeted guidance can raise developmental indicators.",
            "image": {
                "src": "/energy_pooled.png",
                "cite": "https://liser.lu"
            },
            "qrCode": "/qr_codes/family_support_case_study.png",
            "author": "Jane Smith"
          }
        ]
      },
      "health": {
        "projects": [
          {
            "title": "Early Childhood Overview",
            "introduction": "Synthetic introduction for early childhood focusing on family environment and early development.",
            "conclusion": "Key takeaway: stable family support correlates with improved early outcomes.",
            "image": {
                      "src": "/energy_pooled.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": "/qr_codes/early_childhood_overview.png",
            "author": "John Doe"
          },
          {
            "title": "Family Support Case Study",
            "introduction": "Short case study describing targeted support for families with young children.",
            "conclusion": "Case indicates targeted guidance can raise developmental indicators.",
            "image": {
                "src": "/energy_pooled.png",
                "cite": "https://liser.lu"
            },
            "qrCode": "/qr_codes/family_support_case_study.png",
            "author": "Jane Smith"
          }
        ]
      },
      "family": {
          "projects": [
              {
                "title": "Early Childhood Education",
                "introduction": "Overview of early childhood education programs and their impact.",
                "conclusion": "Investing in early education yields long-term benefits.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/early_childhood_education.png",
                "author": "John Doe"
              },
              {
                "title": "Child Development Metrics",
                "introduction": "Summary of key metrics used to assess child development in early years.",
                "conclusion": "Regular assessments help track progress and identify needs.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/child_development_metrics.png",
                "author": "Jane Smith"
              }
            ]
          }
    }
  },
  "ai_future": {
    "stage": "ai_future", 
    "domains": {
      "technology": {
        "projects": [
          {
            "title": "Early Childhood Overview",
            "introduction": "Synthetic introduction for early childhood focusing on family environment and early development.",
            "conclusion": "Key takeaway: stable family support correlates with improved early outcomes.",
            "image": {
                      "src": "/energy_pooled.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": "/qr_codes/early_childhood_overview.png",
            "author": "John Doe"
          },
          {
            "title": "Family Support Case Study",
            "introduction": "Short case study describing targeted support for families with young children.",
            "conclusion": "Case indicates targeted guidance can raise developmental indicators.",
            "image": {
                "src": "/energy_pooled.png",
                "cite": "https://liser.lu"
            },
            "qrCode": "/qr_codes/family_support_case_study.png",
            "author": "Jane Smith"
          }
        ]
      },
      "education": {
        "projects": [
          {
            "title": "Early Childhood Overview",
            "introduction": "Synthetic introduction for early childhood focusing on family environment and early development.",
            "conclusion": "Key takeaway: stable family support correlates with improved early outcomes.",
            "image": {
                      "src": "/energy_pooled.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": "/qr_codes/early_childhood_overview.png",
            "author": "John Doe"
          },
          {
            "title": "Family Support Case Study",
            "introduction": "Short case study describing targeted support for families with young children.",
            "conclusion": "Case indicates targeted guidance can raise developmental indicators.",
            "image": {
                "src": "/energy_pooled.png",
                "cite": "https://liser.lu"
            },
            "qrCode": "/qr_codes/family_support_case_study.png",
            "author": "Jane Smith"
          }
        ]
      },
      "work": {
          "projects": [
              {
                "title": "Early Childhood Education",
                "introduction": "Overview of early childhood education programs and their impact.",
                "conclusion": "Investing in early education yields long-term benefits.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/early_childhood_education.png",
                "author": "John Doe"
              },
              {
                "title": "Child Development Metrics",
                "introduction": "Summary of key metrics used to assess child development in early years.",
                "conclusion": "Regular assessments help track progress and identify needs.",
                "image": {
                    "src": "/energy_pooled.png",
                    "cite": "https://liser.lu"
                },
                "qrCode": "/qr_codes/child_development_metrics.png",
                "author": "Jane Smith"
              }
            ]
          }
    }
  }
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

questions = [
    {
      "id": "leisure_activities",
      "Title": "Leisure Activities",
      "description": "What leisure activities do you enjoy?",
      "choices": [
        "Reading",
        "Traveling",
        "Sports",
        "Gaming"
      ],
      "answer": "Gaming"
    },
    {
      "id": "family_activities",
      "Title": "Family Activities",
      "description": "What activities do you enjoy with your family?",
      "choices": [
        "Game Night",
        "Outdoor Adventures",
        "Movie Marathon",
        "Cooking Together"
      ],
      "answer": "Game Night"
    },
    {
      "id": "education_support",
      "Title": "Education Support",
      "description": "What support do you need for your education?",
      "choices": [
        "Tutoring",
        "Online Resources",
        "Study Groups",
        "Mentorship"
      ],
      "answer": "Online Resources"
    },
    {
      "id": "health_support",
      "Title": "Health Support",
      "description": "What health support do you require?",
      "choices": [
        "Medical Care",
        "Mental Health Services",
        "Nutrition Advice",
        "Fitness Programs"
      ],
      "answer": "Fitness Programs"
    },
    {
      "id": "work_support",
      "Title": "Work Support",
      "description": "What support do you need in your work life?",
      "choices": [
        "Career Counseling",
        "Skill Development",
        "Networking Opportunities",
        "Work-Life Balance Tips"
      ],
      "answer": "Skill Development"
    },
    {
      "id": "wellness_resources",
      "Title": "Wellness Resources",
      "description": "What wellness resources do you find helpful?",
      "choices": [
        "Meditation Apps",
        "Fitness Trackers",
        "Healthy Recipes",
        "Stress Management Workshops"
      ],
      "answer": "Meditation Apps"
    },
    {
      "id": "learning_resources",
      "Title": "Learning Resources",
      "description": "What learning resources do you prefer?",
      "choices": [
        "Online Courses",
        "Books",
        "Podcasts",
        "Webinars"
      ],
      "answer": "Online Courses"
    }
]

domains = [
  { 
    "id": "leisure",
    "label": "Leisure",
    "color": "#e53e3e",
    "icon": "/leisure.gif",
    "questionId": ["leisure_activities", "hobbies"]
  },
  {
    "id": "family",
    "label": "Family",
    "color": "#38a169",
    "icon": "/family.gif",
    "questionId": ["family_support", "family_activities"]
  },
  {
    "id": "education",
    "label": "Education",
    "color": "#3182ce",
    "icon": "/online-education.gif",
    "questionId": ["education_support", "learning_resources"]
  },
  {
    "id": "health",
    "label": "Health",
    "color": "#d69e2e",
    "icon": "/health.gif",
    "questionId": ["health_support", "wellness_resources"]
  },
  {
    "id": "work",
    "label": "Work",
    "color": "#e53e3e",
    "icon": "/work.gif",
    "questionId": ["work_support", "career_resources"]
  }
]


json.dump(life_stages, open("src/data/lifeStages.json", "w"), indent=2, ensure_ascii=False)
json.dump(blurbs, open("src/data/blurbs.json", "w"), indent=2, ensure_ascii=False)
json.dump(graph, open("src/data/graph.json", "w"), indent=2, ensure_ascii=False)
json.dump(questions, open("src/data/questions.json", "w"), indent=2, ensure_ascii=False)
json.dump(domains, open("src/data/domains.json", "w"), indent=2, ensure_ascii=False)
print("Synthetic data written.")
