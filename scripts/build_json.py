import json, pathlib
pathlib.Path("src/data").mkdir(parents=True, exist_ok=True)

life_stages = [
  {
    "id": "early",
    "title": "Early Childhood",
    "icon": "/childhood.png",
    "domains": [
      "family",
      "education"
    ],
    "blurbs": [
      "early_demo"
    ],
    "color": "#00adee",
    "metrics": []
  },
  {
    "id": "adult",
    "title": "Adult Life",
    "icon": "/adult.png",
    "domains": [
      "family",
      "work",
      "health",
      "education"
    ],
    "blurbs": [],
    "color": "#7ad600",
    "metrics": []
  },
  {
    "id": "senior",
    "title": "Senior Life",
    "icon": "/senior.png",
    "domains": [
      "leisure",
      "health",
      "family"
    ],
    "blurbs": [],
    "color": "#e91aab",
    "metrics": []
  },
  {
    "id": "ai_future",
    "title": "AI and the Future",
    "icon": "/ai.png",
    "domains": [
      "technology",
      "education",
      "work"
    ],
    "blurbs": [],
    "color": "#2a2986",
    "metrics": []
  }
]

blurbs = {
  "early": {
    "stage": "early",
    "domains": {
      "wellbeing": {
        "projects": [
          {
            "title": "Child wellbeing in Luxembourg",
            "introduction": "Understanding how children perceive their daily lives and their economic and social environment is essential to assessing their well-being. Traditional indicators often rely on objective measures, such as household income, material deprivation, and school performance, but these are not enough to capture children’s lived experience. A comprehensive understanding of child well-being is crucial for designing and implementing policies that effectively address their needs and promote equitable development.",
            "conclusion": "In 2023, child well-being in Luxembourg is 8.1 on average, but this figure varies with age (younger children tend to be more satisfied with their lives than older children), gender (boys are generally more satisfied than girls), and family status (children from single-parent families are less satisfied).",
            "image": {
                      "src": "public/project_images/child_wellbeing.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": "/qr_codes/early_childhood_overview.png",
            "author": ["Audrey Bousselin"]
          },
          {
            "title": "Parental perceptions of child wellbeing",
            "introduction": "<strong>Parents</strong> spend time, money, and emotional resources to support their children, but they <strong>may not have all the information</strong> needed to make the best choices. This project looks at whether <strong>parents’ views of their children’s wellbeing</strong> match what children themselves say, across areas like emotions and friendships. We then measure how much of any gap comes from differences in opinions versus parents lacking accurate or complete information.",
            "conclusion": "Parents in Luxembourg <strong>systematically underestimate the socio-emotional difficulties</strong> reported by their children across a variety of dimensions. About half of this difference seems to happen because parents don’t have the full picture of what their children are going through. Using an experimental design, we find that <strong>giving parents better information can help close this gap</strong> and guide them to support their children in more effective ways.",
            "image": {
                "src": "public/project_images/parents_perception.png",
                "cite": "https://liser.lu"
            },
            "qrCode": "/qr_codes/family_support_case_study.png",
            "author": ["Giorgia Menta", "Audrey Bousselin"]
        }
      ],
      "questions":["all_is_well","satisfied_with_their_lives","child_can_feel_poor"]
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

questions= {
    "all_is_well":{
        "question": "On average, how much do children aged 8 to 16 in Luxembourg agree with the statement “All is well in my life”, on a scale from 0 to 10?",
        "choices": [
            "8.1",
            "6.5",
            "9.8",
            "4.5"
        ],
        "answer": "8.1"
    },
    "satisfied_with_their_lives":{
        "question": "On average, girls are more satisfied with their lives than boys.",
        "choices": [
            "Boys and girls report similar level of well-being.",
            "Yes, girls report higher level of well-being.",
            "No, girls report lower level of well-being."
        ],
        "answer": "No, girls report lower level of well-being."
    },
    "child_can_feel_poor":{
        "question": "Parents are often the people who know their children best. In Luxembourg, do you think parents on average overstate, understate or are able to correctly estimate their children’s wellbeing?",
        "choices": [
            "Parents understate their children's wellbeing (as compared to what children self-report)",
            "Parents overstate their children's wellbeing (as compared to what children self-report)",
            "Parents and children report similar levels of child wellbeing",
            "I’m not sure, but I’d like to find out"
        ],
        "answer": "Parents understate their children's wellbeing (as compared to what children self-report)"
    }
}
questionss = [
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
  },
  {
    "id": "family",
    "label": "Family",
    "color": "#38a169",
    "icon": "/family.gif",
  },
  {
    "id": "education",
    "label": "Education",
    "color": "#3182ce",
    "icon": "/online-education.gif",
  },
  {
    "id": "health",
    "label": "Health",
    "color": "#d69e2e",
    "icon": "/health.gif",
  },
  {
    "id": "work",
    "label": "Work",
    "color": "#e53e3e",
    "icon": "/work.gif",
  },
  {
      "id": "wellbeing",
      "label": "Wellbeing",
      "color": "#d69e2e",
      "icon": "/wellbeing.gif",
  },
  {
      "id": "poverty",
      "label": "Poverty",
      "color": "#e53e3e",
      "icon": "/poverty.gif",
  }
]


json.dump(life_stages, open("src/data/lifeStages.json", "w"), indent=2, ensure_ascii=False)
json.dump(blurbs, open("src/data/blurbs.json", "w"), indent=2, ensure_ascii=False)
json.dump(graph, open("src/data/graph.json", "w"), indent=2, ensure_ascii=False)
json.dump(questions, open("src/data/questions.json", "w"), indent=2, ensure_ascii=False)
json.dump(domains, open("src/data/domains.json", "w"), indent=2, ensure_ascii=False)
print("Synthetic data written.")
