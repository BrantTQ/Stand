import json, pathlib
pathlib.Path("src/data").mkdir(parents=True, exist_ok=True)

life_stages = [
  {
    "id": "early",
    "title": "Childhood",
    "icon": "/childhood.png",
    "domains": [
      "wellbeing",
      "education",
      "poverty"
    ],
    "color": "#4FC3F7"
  },
  {
    "id": "adult",
    "title": "Adult Life",
    "icon": "/adult.png",
    "domains": [
      "family",
      "inequality"
    ],
    "color": "#2A9D8F"
  },
  {
    "id": "senior",
    "title": "Senior Life",
    "icon": "/senior.png",
    "domains": [
      "health",
      "wellbeing"
    ],
    "color": "#D4A373"
  },
  {
    "id": "ai_future",
    "title": "AI and the Future",
    "icon": "/ai.png",
    "domains": [
      "technology",
    ],
    "color": "#264653"
  }
]

blurbs = {
  "early": {
    "stage": "early",
    "domains": {
      "wellbeing": {
        "projects": [
          {
            "title": "GUIDE Growing Up in Digital Europe: EuroCohort",
            "introduction": "Recent OECD reports stress that to truly understand children’s well-being, it is essential to collect data directly from them. Beyond income, housing, or school results, what really matters is how children perceive their daily lives, opportunities, and challenges. \nGUIDE will be the first large-scale comparative study to follow children across Europe from birth to young adulthood. By regularly gathering both objective indicators and children’s own voices, GUIDE will provide unique insights into how well-being evolves over time. \nWith its strong experience in surveying children in Luxembourg, LISER plays an active role in this pioneering project, supporting healthier, fairer, and more fulfilling lives for future generations.",
            "conclusion": "In 2023, child well-being in Luxembourg is 8.1 on average, but this figure varies with age (younger children tend to be more satisfied with their lives than older children), gender (boys are generally more satisfied than girls), and family status (children from single-parent families are less satisfied). \nThese figures are comparable to neighboring countries (Belgium, France, and Germany).",
            "image": {
                      "src": "/project_images/child_wellbeing.png",
                      "cite": ""
                      },  
            "qrCode": ["/project_qr_codes/ch_well_ggde_qr_1.svg"],
            "author": ["Audrey Bousselin", "Denisa Sologon", "Eugenio Peluso"]
          },
          {
            "title": "Parental perceptions of child wellbeing",
            "introduction": "Parents spend time, money, and emotional resources to support their children, but they may not have all the information needed to make the best choices. This project looks at whether parents’ views of their children’s wellbeing match what children themselves say, across areas like emotions and friendships. We then measure how much of any gap comes from differences in opinions versus parents lacking accurate or complete information.",
            "conclusion": "Parents in Luxembourg systematically underestimate the socio-emotional difficulties reported by their children across a variety of dimensions. About half of this difference seems to happen because parents don’t have the full picture of what their children are going through. Using an experimental design, we find that giving parents better information can help close this gap and guide them to support their children in more effective ways.",
            "image": {
                "src": "/project_images/ch_well_ppc.png",
                "cite": ""
            },
            "qrCode": ["/project_qr_codes/ch_well_ppc_qr_1.svg"],
            "author": ["Giorgia Menta", "Audrey Bousselin"]
        }
      ],
      "questions":["ch_wel_ggd_1","ch_wel_ggd_2","ch_wel_ppc_1"]
      },
      "education": {
          "projects": [
              {
                "title": "Evolution of Social Segregation in Education",
                "introduction": "Between 2009 and 2023, inequalities in Luxembourg’s secondary schools increased across all four dimensions. The share of students not speaking Luxembourgish or German at home rose from 35% to over 54%, those from precarious work households from 10% to over 13%, while poverty grew slightly from 8% to 9%. Children from single-parent families more than doubled, from 3% to over 7%. However, more concerning are the disparities at school level: in 2023, poverty ranged from 2% to nearly 20%, work precarity from under 4% to almost 20%, and linguistic diversity from fewer than 5% to over 80%. Inequalities are thus not only rising but also highly unevenly distributed across schools – a trend requiring close attention.",
                "conclusion": "The concentration of disadvantage in certain schools is a critical concern, as it risks reinforcing unequal opportunities and undermining cohesion. Some schools face combined pressures of poverty, work precarity, linguistic diversity, and family fragility, making them particularly vulnerable. Addressing this requires research and policy cooperation: joint efforts are needed to better understand the drivers and consequences of unequal distribution, and to identify the most effective solutions. Targeted school-level measures—for instance, language support, additional teaching resources, and social services—are essential, while broader contextual factors such as housing patterns, labour market conditions, taxation, and social policy should not be ignored. Preventing excessive concentrations of disadvantage is key to ensuring equitable opportunities across Luxembourg’s schools.",
                "image": {
                    "src": "/project_images/inequalities.gif",
                    "cite": ""
                },
                "qrCode": ["project_qr_codes/ch_edu_esse_qr_1.svg", "project_qr_codes/ch_edu_esse_qr_2.svg"],
                "author": ["Eugenio Peluso", "Philippe Van Kerm", "Aigul Alieva", "Thiago Brant", "Mariagrazia Cavallo"]
              }     
          ],
           "questions":["ch_edu_esse_1","ch_edu_esse_2"]
      },
      "poverty": {
          "projects": [
              {
                  "title": "Children’s poverty perception",
                  "introduction": "Growing up in poverty can limit children’s opportunities and affect how they learn, feel, and plan for the future. Policies often focus on reducing measurable inequalities like low income or lack of resources. But there’s another side: how children see their own situation. Feeling poor can impact confidence, well-being, and life choices—sometimes as much as actual poverty. Our project asks: Do children who feel poor actually live in poverty?  By comparing perceptions with reality, we aim to understand this gap and design policies that address both material and emotional needs.",
                  "conclusion": "Many children worry about money more than their family’s income would suggest. Poverty and financial concerns are linked, but perceptions are shaped by deprivation, parental stress, and peer comparisons. One in three children feel poor without actually being poor, while one in ten are poor but don’t feel that way. Girls, and those reporting a lack of family leisure activities, are most at risk—highlighting the need to address both material resources and perceptions.",
                  "image": {
                      "src": "project_images/poverty_perceptions.png",
                      "cite": ""
                  },
                  "qrCode": ["project_qr_codes/ch_pov_cpp_qr_1.svg"],
                  "author": ["Audrey Bousselin"]
              },
              {
                  "title": "European Child Guarantee (ECG)-LUX",
                  "introduction": "The European Child Guarantee (ECG) Council Recommendation requires each Member State to guarantee access for children in need to free childcare, education, healthcare and school meals, as well as adequate housing and healthy nutrition. Exploiting administrative and survey data, LISER assesses progress and challenges towards the ECG objectives in Luxembourg in biannual reports to the European Commission.",
                  "conclusion": "In Luxembourg, in 2024, a quarter of children under 18—around 33,000—were “at risk of poverty or social exclusion”. Luxembourg ranks 20th in the EU league table. In 2021, the government committed to reducing this number by 2030. \nThe vast majority of those children are income-poor in Luxembourg. Only a small minority are affected by severe material and social deprivation or live in a (quasi-)jobless household, without also being income-poor. The income poverty threshold varies with household composition. It is around 3,300€/month for a lone parent with one child and 5,300€ for a household with two adults and two children.",
                  "image":{
                      "src": "project_images/child_poverty_eu_child_guarantee.png",
                      "cite": ""
                  },
                  "qrCode": ["project_qr_codes/ch_pov_ecg_qr_1.svg"],
                  "author": ["Anne-Catherine Guio", "Eric Marlier"]
              }
          ],
           "questions":["ch_pov_cpp_1","ch_pov_cpp_2","ch_pov_ecg_1","ch_pov_ecg_2"]
      }
      
    }
  },
  "adult": {
    "stage": "adult",
    "domains": {
      "family": {
        "projects": [
          {
            "title": "Evaluation of family policies: focus on parental leave policy take-up and its determinants and outcomes",
            "introduction": "The arrival of children affects the personal and professional lives of parents, as well as the division of paid and unpaid work within a couple. Parental leave is one of the policies designed to reduce the negative consequences of parenthood and to promote gender equality in the division of labour between women and men. A major reform of the parental leave policy took place in Luxembourg in 2016. LISER research, using administrative IGSS data, analysed leave take-up according to various socio-economic characteristics such as nationality, country of residence, gender, work experience, wage, work position, as well as parents’ workplace characteristics, including company size and sector. LISER also evaluated the impact of the parental leave reform on leave take-up.",
            "conclusion": "Key takeaway / policy relevance: \nAnalyses have shown an increase in the uptake of parental leave following the 2016 parental leave reform, particularly among fathers. However, despite this development, inequalities in leave take-up remain. Women and employees in certain economic sectors and larger companies are still more likely to benefit from the policy, and hence to be engaged in childcare and to develop stronger relationships with their children, compared to their male counterparts and parents in other sectors. Evaluating parental leave take-up helps us understand how different groups of the eligible parents respond to the policy and which groups of parents benefit most from it. It uncovers “leave-poor” groups within the parent population, and help policymakers target and design further policy interventions.",
            "image": {
                      "src": "project_images/ad_fam_efp.png",
                      "cite": ""
                      },  
            "qrCode": ["project_qr_codes/ad_fam_efp_qr-1.svg", "project_qr_codes/ad_fam_efp_qr-2.svg"],
            "author": ["Marie Valentova", "Anne-Sophie Genevois", "Kristell Leduc"]
          }
        ],
        "questions":["ad_fam_efp_1","ad_fam_efp_2"]
      },
      "inequality": {
          "projects": [
              {
                "title": "Gender inequality and contemporary challenges",
                "introduction": "In a collaboration with the MEGA, following up on a past project on the gendered effects of the pandemic (COGEL-19), we have examined three interconnected challenges through the lenses of gender: the housing cost crisis, the surge in inflation, and the shift toward sustainable consumption. Housing costs and inflation weigh more heavily on households led by women, particularly low-income renters and single-parent families. Beyond these pressures, gender also shapes sustainable consumption: women generally adopt more eco-responsible behaviours but face more barriers, whereas men are more influenced by information about what others do, especially for easily changeable consumption habits (ex. meat consumption). ",
                "conclusion": "Women in Luxembourg are disproportionately affected by housing costs and inflation, yet they also lead in adopting eco-responsible behaviours. Targeted, gender-sensitive policies can reduce the barriers they face and harness their role as drivers of sustainable change, strengthening both equality and resilience in times of transition.",
                "image": {
                    "src": "project_images/ad_ine_gicc.png",
                    "cite": ""
                },
                "qrCode": ["project_qr_codes/ad_ine_gicc_qr_1.svg", "project_qr_codes/ad_ine_gicc_qr_2.svg"],
                "author": ["Eugenio Peluso", "Giorgia Menta", "Nizamul Islam", "Kristell Leduc", "Nathalie Lorentz", "Denisa M. Sologon", "Philippe Van Kerm", "Bertrand Verheyden"]
              },
              {
                "title": "Intergenerational transmission of inequality",
                "introduction": "Some studies suggest that inheritance taxes can reduce the intergenerational transmission of inequality and promote equality of opportunity. Public views on this tax, however, are divided. For some, inheritances represent an unearned advantage for children who did not generate the wealth themselves, while others regard them as a fair transfer within families. From a policy perspective, inheritance taxation receives mixed support among academics and policymakers alike. Its successful implementation ultimately depends on broad public acceptance, which is why research has increasingly focused on understanding attitudes and preferences toward this form of taxation.",
                "conclusion": "Our results show a clear divide in public opinion on taxation. There is relatively strong support for new wealth and inheritance taxes, but little support for increases in VAT or income taxes. For example, 58% of respondents agree or strongly agree with a one-time tax on net worth, compared with only 24% who support even a small rise in VAT. We also find that support for any tax declines as the expected revenue increases. Overall, our findings suggest that a one-time wealth tax could generate substantial revenue while still enjoying broad public backing.",
                "image": {
                    "src": "project_images/ad_ine_iti.png",
                    "cite": ""
                },
                "qrCode": ["project_qr_codes/ad_ine_iti_qr_1.svg"],
                "author": ["Javier Olivera", "Philippe Van Kerm"]
              }
            ],
          "questions":["ad_ine_gicc_1","ad_ine_gicc_2"]
          }
    }
  },
  "senior": {
    "stage": "senior", 
    "domains": {
      "health": {
        "projects": [
          {
            "title": "Population ageing and public finance burden of dementia",
            "introduction": "Dementia represents a global health challenge that will continue to grow for decades to come. The progressive ageing of the EU population (21% aged over 65 in 2021) and the increase in life expectancy make dementia, a major contributor to disability among the older population. The consistent feature of the dementia syndrome is that patients depend on caregivers as well as health services. Therefore, dementia has a significant impact on public expenditure for healthcare and for long-term care. \nIn this paper, we extended a dynamic model adapted to the specificities of the healthcare system in Luxembourg to estimate the long-term effect of dementia prevalence among individuals aged 50+ on public expenditure for healthcare and long-term care in the country under different scenarios.",
            "conclusion": "The prevalence of dementia is expected to grow from 3.8% in 2025 to 5.3% in 2070. \nThe prevalence of Alzheimer, the most common type of dementia, is expected to grow from 2.8% in 2025 to 4.1% in 2070.\nPublic expenditure on healthcare for individuals affected by dementia in 2070 is projected to be three times its value in 2025.\nPublic expenditure on long-term care for these patients in 2070 is projected to be almost eight times its value in 2025.\nFrom a public health policy perspective, our results could contribute to ex-ante evaluation of preventive strategies to reduce the incidence of dementia. From an economic perspective, our results could contribute to identifying the priorities to limit the impact of an ageing population on public finances.",
            "image": {
                      "src": "/energy_pooled.png",
                      "cite": ""
                      },  
            "qrCode": ["project_qr_codes/sn_hea_papf_qr_1.svg"],
            "author": ["Maria Noel Pi Alperin"]
          },
          {
            "title": "Survey of Health, Ageing and Retirement in Europe (SHARE)",
            "introduction": "The population ageing process represents one of the most important demographic processes of the last decades in Europe and beyond. As people are getting older, while birth rate is declining and life expectancy increasing, the ageing of the population is expected to accelerate. The same applies for Luxembourg, which has one of the highest life expectancies in Europe. The ageing of the population will have a high impact on the economy and the way our society will be organised. \nSHARE, the Survey of Health, Ageing and Retirement in Europe, is a research infrastructure for studying the effects of health, social, economic and environmental policies over the life-course of European citizens and beyond.",
            "conclusion": "<p>Since its creation in 2004:</p><ul class=\"list-disc list-inside\"><li>SHARE has set new standards in research and scientific data collection</li><li>SHARE has provided policymakers with reliable and comparable data on which they can base their decisions to address socio-economic and public health challenges using scientific evidence and thus contribute to improving the living conditions of European citizens.</li></ul> <br/> <p>More than 20 years of existence:</p><ul class=\"list-disc list-inside\"><li>28 country teams, 160.000 participants, more than 600.000 interviews collected</li><li>Luxembourg joined the SHARE project in 2013</li><li>Six waves of data already collected</li><li>More than 3000 participants</li><li>More than 80 scientific publications using the Luxembourgish data of SHARE</li></ul>",
            "image": {
                "src": "/energy_pooled.png",
                "cite": ""
            },
            "qrCode": ["project_qr_codes/sn_hea_shar_qr_1.svg", "project_qr_codes/sn_hea_shar_qr_2.svg"],
            "author": ["Maria Noel Pi Alperin", "Gaetan de Lanchy", "Jordane Segura"]
          }
        ],
        "questions":["sn_hea_shar_1","sn_hea_shar_2","sn_hea_papf_1","sn_hea_papf_2"]
      },
      "wellbeing": {
        "projects": [
            {
                "title":"Studying Active Ageing",
                "introduction":"Defined by the World Health Organization, <strong>Active Ageing</strong> allows people to realize their potential for physical, social, and mental wellbeing throughout the life course and to participate in society according to their needs, desires and capacities, while providing them with adequate protection, security and care when they require assistance.\nThe <strong>Active Ageing Index (AAI)</strong> measures ongoing participation in social, economic, cultural, spiritual, and civic activities, as well as wellbeing, autonomy, and independence.",
                "conclusion": "Luxembourg ranks very well in active ageing with respect to other European countries. However, Luxembourg’s Gini index for the AAI is relatively high, suggesting scope for policies that foster more equitable well-being among older adults.",
                "image":{
                    "src": "/project_images/sn_wel_saa.bmp",
                    "cite": ""
                },
                "qrCode": ["project_qr_codes/sn_wel_saa_qr_1.svg"],
                "author": ["Javier Olivera"]
            },
            {
                "title":"Portability of pension plans",
                "introduction":"In April 2024, LISER conducted a discrete choice experiment to explore how willing people are to join a portable voluntary pension plan that can move with them across the EU. The study was inspired by the <strong>Pan-European Personal Pension Product (PEPP)</strong>, an EU initiative designed to make supplementary pensions more flexible and transferable between member states. Participants compared alternative pension plans, some with portability and others without, while also facing varying potential losses in pension balance due to management fees. The research reveals how portability and costs influence people’s decisions to save for retirement across borders.",
                "conclusion": "The study shows that, on average, people are willing to give up 3.6% of their pension savings to have a plan that is portable across EU countries. For example, someone might prefer a portable pension with a 1% annual fee over a non-portable one with a 0.65% fee (assuming a 20-year plan and 5% return). Portability matters most to people who are likely to move for work—such as non-homeowners, those planning to work abroad, those with past work experience abroad, and people under 40. Offering flexible, portable pensions can help individuals build personal retirement savings while reducing pressure on public pensions. This is particularly relevant for Luxembourg, where many workers have international careers.",
                "image":{
                    "src": "/project_images/sn_wel_ppp.png",
                    "cite": ""
                },
                "qrCode": ["project_qr_codes/sn_wel_ppp_qr_1.svg", "project_qr_codes/sn_wel_ppp_qr_2.svg"],
                "author": ["Javier Olivera", "Uyen Nguyen-Thi", "Ludivine Martin"]
            }
        ],
        "questions":["sn_wel_ppp_1","sn_wel_ppp_2"]
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
    "ad_ine_gicc_1":{
        "question": "Which of these hypothetical green policies is supported by more women than men?",
        "choices": [
            "Increasing the VAT on red meat from 3% to 17%",
            "Introducing a 5-euro highway toll",
            "Rationing on fossil energy sources",
            "None of the above"
        ],
        "answer": "Rationing on fossil energy sources"
    },
    "ad_ine_gicc_2":{
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
    },
    "sn_hea_shar_1":{
        "question": "The percentage of the total population that are over 50 years old in Luxembourg is",
        "choices": [
            "25%",
            "35%",
            "45%"
        ],
        "answer": "35%"
    },
    "sn_hea_shar_2":{
        "question": "The percentage of the total population that are over 65 years old in Luxembourg is",
        "choices": [
            "Less than 10%",
            "More than 14%",
            "More than 20%"
        ],
        "answer": "More than 14%"
    },
    "sn_hea_papf_1":{
        "question": "In Luxembourg, more than 1.25% of the total population is affected by dementia. This share is projected to...",
        "choices": [
            "Be the same in 2050",
            "Reach 2.04% of the population",
            "Reach 2.44% of the total population"
        ],
        "answer": "Reach 2.44% of the total population"
    },
    "sn_hea_papf_2":{
        "question": "Luxembourg has similar dementia prevalence rates than",
        "choices": [
            "Belgium",
            "Cyprus",
            "France"
        ],
        "answer": "Cyprus"
    },
    "sn_wel_ppp_1":{
        "question": "On average, what additional share of their pension savings did participants in our study say they would give up for a portable pension plan?",
        "choices": [
            "1.2%",
            "3.6%",
            "5.2%",
            "2.4%"
        ],
        "answer": "3.6%"
    },
    "sn_wel_ppp_2":{
        "question": "In our study, which group was more willing to pay extra for a portable pension plan?",
        "choices": [
            "People over 40",
            "Cross-border workers living in Belgium",
            "People who are not homeowners",
            "Women"
        ],
        "answer": "People over 40"
    }
    

}

domains = [
  {
    "id": "family",
    "label": "Family",
    "color": "#38a169",
    "icon": "/family.png"
  },
  {
    "id": "education",
    "label": "Education",
    "color": "#3182ce",
    "icon": "/education.png"
  },
  {
    "id": "health",
    "label": "Health",
    "color": "#d69e2e",
    "icon": "/health.png"
  },
  {
    "id": "work",
    "label": "Work",
    "color": "#e53e3e",
    "icon": "/work.gif"
  },
  {
    "id": "wellbeing",
    "label": "Wellbeing",
    "color": "#3182ce",
    "icon": "/wellbeing.png"
  },
   {
    "id": "poverty",
    "label": "Poverty",
    "color": "#3182ce",
    "icon": "/poverty.png"
  },
    {
      "id": "inequality",
      "label": "Inequality",
      "color": "#38a169",
      "icon": "/inequality.png"
    },
    {
      "id": "technology",
      "label": "Technology",
      "color": "#805ad5",
      "icon": "/technology.png"
    }
]


json.dump(life_stages, open("src/data/lifeStages.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
json.dump(blurbs, open("src/data/blurbs.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
json.dump(graph, open("src/data/graph.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
json.dump(questions, open("src/data/questions.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
json.dump(domains, open("src/data/domains.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("Synthetic data written.")
