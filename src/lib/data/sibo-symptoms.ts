export type SiboSymptom = {
  symptom: string
  category: string
  severity_avg: number
  affected_pct: number
  common_triggers: string
  relief_methods: string
}

export const siboSymptoms: SiboSymptom[] = [
  {"symptom":"Abdominal Pain","category":"Digestive","severity_avg":7.2,"affected_pct":70,"common_triggers":"Eating large meals, high-fiber foods","relief_methods":"Peppermint oil, heat pad, IBgard"},
  {"symptom":"Acid Reflux","category":"Digestive","severity_avg":6.2,"affected_pct":50,"common_triggers":"Spicy food, caffeine, lying after meals","relief_methods":"DGL licorice, betaine HCL, elevated sleeping"},
  {"symptom":"Anxiety","category":"Neurological","severity_avg":6,"affected_pct":45,"common_triggers":"Gut-brain axis dysfunction, inflammation","relief_methods":"Magnesium, L-theanine, vagus nerve stimulation"},
  {"symptom":"Bloating","category":"Digestive","severity_avg":7.8,"affected_pct":85,"common_triggers":"High-FODMAP foods, wheat, dairy","relief_methods":"Low-FODMAP diet, peppermint oil, digestive enzymes"},
  {"symptom":"Brain Fog","category":"Neurological","severity_avg":7,"affected_pct":60,"common_triggers":"Post-meal, high-carb meals","relief_methods":"Berberine, NAC, fasting windows"},
  {"symptom":"Constipation","category":"Digestive","severity_avg":6,"affected_pct":45,"common_triggers":"Low fiber, dehydration, certain probiotics","relief_methods":"Magnesium citrate, psyllium, hydration"},
  {"symptom":"Diarrhea","category":"Digestive","severity_avg":6.8,"affected_pct":55,"common_triggers":"Dairy, fructose, stress","relief_methods":"Probiotics, bismuth, dietary changes"},
  {"symptom":"Fatigue","category":"Systemic","severity_avg":7.5,"affected_pct":75,"common_triggers":"Nutrient malabsorption, inflammation","relief_methods":"B12, iron testing, anti-inflammatory protocol"},
  {"symptom":"Food Sensitivities","category":"Immune","severity_avg":6.8,"affected_pct":65,"common_triggers":"Multiple triggers, leaky gut","relief_methods":"L-glutamine, zinc carnosine, elimination diet"},
  {"symptom":"Gas/Flatulence","category":"Digestive","severity_avg":6.5,"affected_pct":80,"common_triggers":"Beans, cruciferous vegetables, sugar alcohols","relief_methods":"Activated charcoal, simethicone, enzyme supplements"},
  {"symptom":"Insomnia","category":"Neurological","severity_avg":5.8,"affected_pct":35,"common_triggers":"Evening meals, gut discomfort","relief_methods":"Melatonin, magnesium glycinate, early dinner"},
  {"symptom":"Joint Pain","category":"Systemic","severity_avg":5,"affected_pct":30,"common_triggers":"Inflammatory foods, gluten","relief_methods":"Omega-3, turmeric, elimination diet"},
  {"symptom":"Nausea","category":"Digestive","severity_avg":5.5,"affected_pct":40,"common_triggers":"Morning meals, fatty foods","relief_methods":"Ginger, small frequent meals"},
  {"symptom":"Skin Issues","category":"Dermatological","severity_avg":5.5,"affected_pct":35,"common_triggers":"Histamine-rich foods, dairy","relief_methods":"Quercetin, DAO enzymes, probiotics"},
  {"symptom":"Weight Changes","category":"Metabolic","severity_avg":5,"affected_pct":40,"common_triggers":"Malabsorption or bacterial fermentation","relief_methods":"Address underlying SIBO, nutritional support"},
]
