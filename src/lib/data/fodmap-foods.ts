export type FodmapFood = {
  food: string
  category: string
  fodmap_level: "low" | "moderate" | "high"
  fructose: number
  lactose: number
  fructans: number
  galactans: number
  polyols: number
  serving_size: string
  safe_amount: string
  notes: string
}

export const fodmapFoods: FodmapFood[] = [
  {"food":"Almonds","category":"Nut","fodmap_level":"moderate","fructose":0,"lactose":0,"fructans":0,"galactans":1,"polyols":0,"serving_size":"1/4 cup","safe_amount":"10 almonds","notes":"OK in small amounts"},
  {"food":"Apple","category":"Fruit","fodmap_level":"high","fructose":8,"lactose":0,"fructans":0,"galactans":0,"polyols":5,"serving_size":"1 medium","safe_amount":"none safe","notes":"Fructose + sorbitol"},
  {"food":"Avocado","category":"Fruit","fodmap_level":"high","fructose":2,"lactose":0,"fructans":0,"galactans":0,"polyols":8,"serving_size":"1 whole","safe_amount":"1/8 avocado","notes":"High in sorbitol"},
  {"food":"Banana (ripe)","category":"Fruit","fodmap_level":"low","fructose":3,"lactose":0,"fructans":2,"galactans":0,"polyols":0,"serving_size":"1 medium","safe_amount":"1 medium","notes":"Safe when ripe"},
  {"food":"Blueberries","category":"Fruit","fodmap_level":"low","fructose":2,"lactose":0,"fructans":0,"galactans":0,"polyols":0,"serving_size":"1 cup","safe_amount":"1 cup","notes":"Generally safe"},
  {"food":"Broccoli","category":"Vegetable","fodmap_level":"moderate","fructose":0,"lactose":0,"fructans":3,"galactans":1,"polyols":2,"serving_size":"1 cup","safe_amount":"3/4 cup","notes":"OK in small amounts"},
  {"food":"Cashews","category":"Nut","fodmap_level":"high","fructose":0,"lactose":0,"fructans":0,"galactans":5,"polyols":0,"serving_size":"1/4 cup","safe_amount":"10 nuts max","notes":"GOS content"},
  {"food":"Chickpeas","category":"Legume","fodmap_level":"high","fructose":0,"lactose":0,"fructans":2,"galactans":7,"polyols":0,"serving_size":"1/2 cup","safe_amount":"1/4 cup canned","notes":"GOS content"},
  {"food":"Garlic","category":"Vegetable","fodmap_level":"high","fructose":0,"lactose":0,"fructans":9,"galactans":0,"polyols":0,"serving_size":"1 clove","safe_amount":"garlic oil only","notes":"Highest fructan source"},
  {"food":"Hard cheese","category":"Dairy","fodmap_level":"low","fructose":0,"lactose":0,"fructans":0,"galactans":0,"polyols":0,"serving_size":"40g","safe_amount":"40g","notes":"Negligible lactose"},
  {"food":"Honey","category":"Sweetener","fodmap_level":"high","fructose":10,"lactose":0,"fructans":2,"galactans":0,"polyols":0,"serving_size":"1 tbsp","safe_amount":"none safe","notes":"Very high fructose"},
  {"food":"Lentils","category":"Legume","fodmap_level":"high","fructose":0,"lactose":0,"fructans":2,"galactans":5,"polyols":0,"serving_size":"1/2 cup","safe_amount":"1/4 cup canned","notes":"Canned lower FODMAP"},
  {"food":"Maple syrup","category":"Sweetener","fodmap_level":"low","fructose":1,"lactose":0,"fructans":0,"galactans":0,"polyols":0,"serving_size":"1 tbsp","safe_amount":"2 tbsp","notes":"Safe alternative"},
  {"food":"Milk (cow)","category":"Dairy","fodmap_level":"high","fructose":0,"lactose":9,"fructans":0,"galactans":0,"polyols":0,"serving_size":"1 cup","safe_amount":"lactose-free","notes":"Lactose source"},
  {"food":"Oats","category":"Grain","fodmap_level":"low","fructose":0,"lactose":0,"fructans":1,"galactans":0,"polyols":0,"serving_size":"1/2 cup","safe_amount":"1/2 cup","notes":"Generally safe"},
  {"food":"Onion","category":"Vegetable","fodmap_level":"high","fructose":0,"lactose":0,"fructans":8,"galactans":0,"polyols":0,"serving_size":"1/2 cup","safe_amount":"green tops only","notes":"Major trigger"},
  {"food":"Rice","category":"Grain","fodmap_level":"low","fructose":0,"lactose":0,"fructans":0,"galactans":0,"polyols":0,"serving_size":"1 cup","safe_amount":"unlimited","notes":"Very safe"},
  {"food":"Spinach","category":"Vegetable","fodmap_level":"low","fructose":0,"lactose":0,"fructans":0,"galactans":0,"polyols":0,"serving_size":"1 cup","safe_amount":"unlimited","notes":"Very safe"},
  {"food":"Wheat bread","category":"Grain","fodmap_level":"high","fructose":0,"lactose":0,"fructans":7,"galactans":0,"polyols":0,"serving_size":"2 slices","safe_amount":"sourdough 2 slices","notes":"Fructans in wheat"},
  {"food":"Yogurt (regular)","category":"Dairy","fodmap_level":"moderate","fructose":0,"lactose":5,"fructans":0,"galactans":0,"polyols":0,"serving_size":"200g","safe_amount":"lactose-free","notes":"Some lactose"},
]
