export type CarnivoreFood = {
  food: string
  category: string
  calories_per_100g: number
  protein_g: number
  fat_g: number
  carbs_g: number
  histamine_risk: "none" | "low" | "moderate" | "high"
  oxalate_risk: string
  omega3_score: number
  bioavailability: number
  sibo_safe: boolean
}

export const carnivoreFoods: CarnivoreFood[] = [
  {"food":"Beef Heart","category":"Organ Meat","calories_per_100g":112,"protein_g":17,"fat_g":4,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.2,"bioavailability":9.5,"sibo_safe":true},
  {"food":"Beef Liver","category":"Organ Meat","calories_per_100g":135,"protein_g":20,"fat_g":4,"carbs_g":4,"histamine_risk":"moderate","oxalate_risk":"none","omega3_score":0.3,"bioavailability":10,"sibo_safe":true},
  {"food":"Beef Tallow","category":"Fat","calories_per_100g":902,"protein_g":0,"fat_g":100,"carbs_g":0,"histamine_risk":"none","oxalate_risk":"none","omega3_score":0.1,"bioavailability":6,"sibo_safe":true},
  {"food":"Bison","category":"Red Meat","calories_per_100g":143,"protein_g":28,"fat_g":2,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.3,"bioavailability":9.5,"sibo_safe":true},
  {"food":"Bone Broth","category":"Broth","calories_per_100g":31,"protein_g":5,"fat_g":1,"carbs_g":0,"histamine_risk":"high","oxalate_risk":"none","omega3_score":0,"bioavailability":8,"sibo_safe":true},
  {"food":"Butter","category":"Dairy Fat","calories_per_100g":717,"protein_g":1,"fat_g":81,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.3,"bioavailability":7,"sibo_safe":true},
  {"food":"Chicken Breast","category":"Poultry","calories_per_100g":165,"protein_g":31,"fat_g":4,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.1,"bioavailability":8.5,"sibo_safe":true},
  {"food":"Chicken Thighs","category":"Poultry","calories_per_100g":209,"protein_g":26,"fat_g":11,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.1,"bioavailability":8,"sibo_safe":true},
  {"food":"Cod","category":"Fish","calories_per_100g":82,"protein_g":18,"fat_g":0.7,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.2,"bioavailability":8,"sibo_safe":true},
  {"food":"Collagen Peptides","category":"Supplement","calories_per_100g":350,"protein_g":90,"fat_g":0,"carbs_g":0,"histamine_risk":"none","oxalate_risk":"none","omega3_score":0,"bioavailability":7,"sibo_safe":true},
  {"food":"Duck","category":"Poultry","calories_per_100g":337,"protein_g":19,"fat_g":28,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.1,"bioavailability":8,"sibo_safe":true},
  {"food":"Eggs","category":"Eggs","calories_per_100g":155,"protein_g":13,"fat_g":11,"carbs_g":1,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.1,"bioavailability":9,"sibo_safe":true},
  {"food":"Ghee","category":"Dairy Fat","calories_per_100g":900,"protein_g":0,"fat_g":100,"carbs_g":0,"histamine_risk":"none","oxalate_risk":"none","omega3_score":0.4,"bioavailability":7,"sibo_safe":true},
  {"food":"Ground Beef 80/20","category":"Red Meat","calories_per_100g":254,"protein_g":26,"fat_g":17,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.2,"bioavailability":9,"sibo_safe":true},
  {"food":"Lamb Chops","category":"Red Meat","calories_per_100g":294,"protein_g":25,"fat_g":21,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.4,"bioavailability":9,"sibo_safe":true},
  {"food":"Pork Belly","category":"Pork","calories_per_100g":518,"protein_g":9,"fat_g":53,"carbs_g":0,"histamine_risk":"moderate","oxalate_risk":"none","omega3_score":0.1,"bioavailability":7.5,"sibo_safe":true},
  {"food":"Ribeye Steak","category":"Red Meat","calories_per_100g":271,"protein_g":26,"fat_g":18,"carbs_g":0,"histamine_risk":"low","oxalate_risk":"none","omega3_score":0.3,"bioavailability":9.5,"sibo_safe":true},
  {"food":"Salmon","category":"Fish","calories_per_100g":208,"protein_g":20,"fat_g":13,"carbs_g":0,"histamine_risk":"moderate","oxalate_risk":"none","omega3_score":2.2,"bioavailability":9,"sibo_safe":true},
  {"food":"Sardines","category":"Fish","calories_per_100g":208,"protein_g":25,"fat_g":11,"carbs_g":0,"histamine_risk":"high","oxalate_risk":"none","omega3_score":1.5,"bioavailability":9.5,"sibo_safe":true},
  {"food":"Shrimp","category":"Seafood","calories_per_100g":99,"protein_g":24,"fat_g":0.3,"carbs_g":0,"histamine_risk":"moderate","oxalate_risk":"none","omega3_score":0.5,"bioavailability":8.5,"sibo_safe":true},
]
