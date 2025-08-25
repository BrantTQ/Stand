import json, pathlib
pathlib.Path("src/data").mkdir(parents=True, exist_ok=True)

life_stages = [
  {
    "id": "early",
    "title": "Childhood",
    "icon": "/childhood.png",
    "domains": [
      "family",
      "education",
      "wellbeing"
    ],
    "color": "#00adee"
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
    "color": "#7ad600"
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
    "color": "#e91aab"
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
    "color": "#2a2986"
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
                      "src": "/project_images/child_wellbeing.png",
                      "cite": "https://liser.lu"
                      },  
            "qrCode": ["/project_qr_codes/adult_family_policies.svg", "/project_qr_codes/adult_family_policies.svg"],
            "author": ["Eugenio Peluso, Philippe Van Kerm, Aigul Alieva, Thiago Brant, Mariagrazia Cavallo"]
          },
          {
            "title": "Parental perceptions of child wellbeing",
            "introduction": "Parents spend time, money, and emotional resources to support their children, but they may not have all the information needed to make the best choices. This project looks at whether parents’ views of their children’s wellbeing match what children themselves say, across areas like emotions and friendships. We then measure how much of any gap comes from differences in opinions versus parents lacking accurate or complete information.",
            "conclusion": "Parents in Luxembourg systematically underestimate the socio-emotional difficulties reported by their children across a variety of dimensions. About half of this difference seems to happen because parents don’t have the full picture of what their children are going through. Using an experimental design, we find that giving parents better information can help close this gap and guide them to support their children in more effective ways.",
            "image": {
                "src": "/project_images/parents_perception.png",
                "cite": "https://liser.lu"
            },
            "qrCode": ["/qr_codes/family_support_case_study.png"],
            "author": ["Giorgia Menta", "Audrey Bousselin"]
        }
      ],
      "questions":["ch_wel_ggd_1","ch_wel_ggd_2","ch_wel_ppc_1"]
      },
      "education": {
          "projects": [
              {
                "title": "Early Childhood Education",
                "introduction": "Between 2009 and 2023, inequalities in Luxembourg’s secondary schools increased across all four dimensions. The share of students not speaking Luxembourgish or German at home rose from 35% to over 54%, those from precarious work households from 10% to over 13%, while poverty grew slightly from 8% to 9%. Children from single-parent families more than doubled, from 3% to over 7%. However, more concerning are the disparities at school level: in 2023, poverty ranged from 2% to nearly 20%, work precarity from under 4% to almost 20%, and linguistic diversity from fewer than 5% to over 80%. Inequalities are thus not only rising but also highly unevenly distributed across schools – a trend requiring close attention.",
                "conclusion": "The concentration of disadvantage in certain schools is a critical concern, as it risks reinforcing unequal opportunities and undermining cohesion. Some schools face combined pressures of poverty, work precarity, linguistic diversity, and family fragility, making them particularly vulnerable. Addressing this requires research and policy cooperation: joint efforts are needed to better understand the drivers and consequences of unequal distribution, and to identify the most effective solutions. Targeted school-level measures—for instance, language support, additional teaching resources, and social services—are essential, while broader contextual factors such as housing patterns, labour market conditions, taxation, and social policy should not be ignored. Preventing excessive concentrations of disadvantage is key to ensuring equitable opportunities across Luxembourg’s schools.",
                "image": {
                    "src": "/project_images/inequalities.gif",
                    "cite": "https://liser.lu"
                },
                "qrCode": ["/project_qr_codes/adult_family_policies.svg", "/project_qr_codes/adult_family_policies.svg"],
                "author": "Eugenio Peluso, Philippe Van Kerm, Aigul Alieva, Thiago Brant, Mariagrazia Cavallo"
              }     
          ],
           "questions":["ch_edu_esse_1","ch_edu_esse_2"]
      }
  }},
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
            "qrCode": ["/qr_codes/early_childhood_overview.png"],
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
            "qrCode": ["/qr_codes/family_support_case_study.png"],
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
                "qrCode": ["/qr_codes/early_childhood_education.png"],
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
                "qrCode": ["/qr_codes/child_development_metrics.png"],
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
            "qrCode": ["/qr_codes/family_support_case_study.png"],
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
            "qrCode": ["/qr_codes/early_childhood_overview.png"],
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
            "qrCode": ["/qr_codes/family_support_case_study.png"],
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
                "qrCode": ["/qr_codes/early_childhood_education.png"],
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
                "qrCode": ["/qr_codes/child_development_metrics.png"],
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
            "qrCode": ["/qr_codes/early_childhood_overview.png"],
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
            "qrCode": ["/qr_codes/family_support_case_study.png"],
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
            "qrCode": ["/qr_codes/early_childhood_overview.png"],
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
            "qrCode": ["/qr_codes/family_support_case_study.png"],
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
                "qrCode": ["/qr_codes/early_childhood_education.png"],
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
                "qrCode": ["/qr_codes/child_development_metrics.png"],
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
    "ch_wel_ggd_1":{
        "question": "On average, how much do children aged 8 to 16 in Luxembourg agree with the statement “All is well in my life”, on a scale from 0 to 10?",
        "choices": [
            "8.1",
            "6.5",
            "9.8",
            "4.5"
        ],
        "answer": "8.1"
    },
    "ch_wel_ggd_2":{
        "question": "On average, girls are more satisfied with their lives than boys?",
        "choices": [
            "Boys and girls report similar level of well-being.",
            "Yes, girls report higher level of well-being.",
            "No, girls report lower level of well-being."
        ],
        "answer": "No, girls report lower level of well-being."
    },
    "ch_wel_ppc_1":{
        "question": "Parents are often the people who know their children best. In Luxembourg, do you think parents on average overstate, understate or are able to correctly estimate their children’s wellbeing?",
        "choices": [
            "Parents understate their children's wellbeing (as compared to what children self-report)",
            "Parents overstate their children's wellbeing (as compared to what children self-report)",
            "Parents and children report similar levels of child wellbeing",
            "I’m not sure, but I’d like to find out"
        ],
        "answer": "Parents understate their children's wellbeing (as compared to what children self-report)"
    },
    "ad_fam_efp_1":{
        "question":"A major parental leave policy reform took place in Luxembourg in 2016. LISER evaluated the effect of the reform on parental leave take-up behaviour. Whose parental leave take-up increased the most after the reform?",
        "choices": [
            "Mothers",
            "Fathers",
            "None",
            "Both equally"
        ],
        "answer": "Fathers"
    },
    "ad_fam_efp_2":{
        "question":"LISER studies have analysed the factors that affect parental leave take-up among parents, including how employers’ characteristics influence uptake. In which type of firms is the take-up lowest?",
        "choices": [
            "The take-up does not differ depending on employer size",
            "Employers with fewer than 50 employees",
            "Employers with 50 to 100 employees",
            "Employers with more than 100 employees"
        ],
        "answer": "Employers with fewer than 50 employees"
    },
    "ch_pov_cpp_1":{
        "question": "According to our data, a child can feel poor…",
        "choices": [
            "Only if their family income is below the poverty line",
            "Even if their family income is not below the poverty line",
            "Only if they are materially deprived (ex. lack of clothes in good conditions, things needed for sport and leisure activities, books…)"
        ],
        "answer": "Even if their family income is not below the poverty line"
    },
    "ch_pov_cpp_2":{
        "question": "Which factor is a strong predictor of children feeling poor, even when they are not?",
        "choices": [
            "Age",
            "Number of siblings",
            "Gender"
        ],
        "answer": "Gender"
    },
    "ch_pov_ecg_1":{
        "question": "In 2024, Luxembourg ranks in terms of child poverty and social exclusion among:",
        "choices": [
            "The 8 EU best performers",
            "The 8 EU worst performers"
        ],
        "answer": "The 8 EU worst performers"
    },
    "ch_pov_ecg_2":{
        "question": "In 2024, In Luxembourg the vast majority of children “at risk of poverty or social exclusion” live:",
        "choices": [
            "In a low-income household",
            "With jobless parents",
            "In a severely deprived household"
        ],
        "answer": "In a low-income household"
    },
    "ad_fam_gicc_1":{
        "question": "Which of these hypothetical green policies is supported by more women than men?",
        "choices": [
            "Increasing the VAT on red meat from 3% to 17%",
            "Introducing a 5-euro highway toll",
            "Rationing on fossil energy sources",
            "None of the above"
        ],
        "answer": "Rationing on fossil energy sources"
    },
    "ad_fam_gicc_2":{
        "question": "Why are women more vulnerable to the impacts of inflation in Luxembourg?",
        "choices": [
            "Women typically have less access to financial resources like savings to manage unexpected expenses",
            "Women tend to allocate a larger share of their income to essential goods and services, such as food and heating",
            "Single parents, who typically face lower average incomes and reduced capacity to absorb rising costs, are predominantly women",
            "All of the above"
        ],
        "answer": "All of the above"
    },

    "ch_edu_esse_1":{
        "question": "Which region in Luxembourg has the least number of secondary schools?",
        "choices": [
            "Région Centre",
            "Région Sud",
            "Région Nord",
            "Région Est"
        ],
        "answer": "Région Est"
    },
    "ch_edu_esse_2":{
        "question": "In which year did the law on primary education begin to include parents’ preferences for track placement (ESC, ESG, ESG-VO) when moving from primary to secondary school?",
        "choices": [
            "2003",
            "2009",
            "2015",
            "2023"
        ],
        "answer": "2009"
    }

}

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
