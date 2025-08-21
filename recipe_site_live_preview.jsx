import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Star, Flame, ChefHat, Plus, X, Moon, Sun, Filter, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// ------- Sample Data -------
const SAMPLE_RECIPES = [
  {
    id: "1",
    title: "One-Pan Garlic Butter Chicken & Rice",
    category: "Dinner",
    time: 35,
    difficulty: "Easy",
    calories: 520,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1604908554007-4b7c7f3b4d1c?q=80&w=1600&auto=format&fit=crop",
    tags: ["Chicken", "Comfort", "One-Pot"],
    ingredients: [
      "2 chicken breasts",
      "1 cup basmati rice",
      "3 tbsp butter",
      "4 cloves garlic, minced",
      "2 cups chicken stock",
      "Salt & pepper",
      "Parsley for garnish"
    ],
    steps: [
      "Season chicken and sear in butter until golden.",
      "Add garlic, rice, and stock; bring to a simmer.",
      "Cover and cook 15 minutes; rest 5 minutes.",
      "Fluff, garnish, and serve."
    ]
  },
  {
    id: "2",
    title: "15-Min Creamy Pesto Pasta",
    category: "Lunch",
    time: 15,
    difficulty: "Easy",
    calories: 430,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8bbf?q=80&w=1600&auto=format&fit=crop",
    tags: ["Vegetarian", "Quick", "Pasta"],
    ingredients: [
      "250g pasta",
      "3 tbsp pesto",
      "1/2 cup cream",
      "Parmesan, grated",
      "Salt to taste"
    ],
    steps: [
      "Cook pasta until al dente.",
      "Stir pesto and cream in a pan.",
      "Add pasta and toss with parmesan."
    ]
  },
  {
    id: "3",
    title: "Smoky Shakshuka",
    category: "Breakfast",
    time: 25,
    difficulty: "Medium",
    calories: 380,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
    tags: ["Eggs", "Spicy", "Skillet"],
    ingredients: [
      "1 onion, sliced",
      "2 bell peppers",
      "2 cups crushed tomatoes",
      "4 eggs",
      "1 tsp smoked paprika",
      "Chili flakes, salt, pepper"
    ],
    steps: [
      "Soften onions & peppers.",
      "Add tomatoes & spices; simmer.",
      "Make wells and crack in eggs; cover until set."
    ]
  },
  {
    id: "4",
    title: "Crispy Falafel Wraps",
    category: "Street Food",
    time: 40,
    difficulty: "Medium",
    calories: 450,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1616177608274-17a49b82a2e4?q=80&w=1600&auto=format&fit=crop",
    tags: ["Vegan", "Crispy", "Legumes"],
    ingredients: [
      "2 cups soaked chickpeas",
      "Garlic & herbs",
      "Spices",
      "Wraps, tahini sauce, veggies"
    ],
    steps: [
      "Blend chickpeas with herbs & spices.",
      "Form balls; fry/air-fry until crisp.",
      "Assemble wraps with tahini & veggies."
    ]
  },
  {
    id: "5",
    title: "No-Bake Lotus Cheesecake",
    category: "Dessert",
    time: 20,
    difficulty: "Easy",
    calories: 510,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1600&auto=format&fit=crop",
    tags: ["Sweet", "No-Bake", "Creamy"],
    ingredients: [
      "Lotus biscuits, crushed",
      "Butter",
      "Cream cheese",
      "Condensed milk",
      "Lotus spread"
    ],
    steps: [
      "Mix biscuit crumbs with butter; press into tin.",
      "Beat cheese with condensed milk & spread.",
      "Pour, chill 4h; top with more Lotus."
    ]
  }
];

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Street Food", "Drinks", "Vegan", "Quick"];

// ------- Helpers -------
function clsx(...xs) { return xs.filter(Boolean).join(" "); }

function useDarkMode() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [dark]);
  return { dark, setDark };
}

// ------- App -------
export default function RecipeSite() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("trending");
  const [recipes, setRecipes] = useState(SAMPLE_RECIPES);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(1);
  const { dark, setDark } = useDarkMode();

  const pageSize = 6;

  const filtered = useMemo(() => {
    let list = recipes.filter(r =>
      (cat === "All" || r.category === cat || (cat === "Vegan" && r.tags.includes("Vegan")) || (cat === "Quick" && r.time <= 20)) &&
      r.title.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "trending") list = list.sort((a,b) => b.rating - a.rating);
    if (sort === "time") list = list.sort((a,b) => a.time - b.time);
    if (sort === "calories") list = list.sort((a,b) => a.calories - b.calories);
    return list;
  }, [recipes, cat, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page-1)*pageSize, page*pageSize);

  useEffect(() => { setPage(1); }, [query, cat, sort]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <motion.div initial={{ scale: 0.9, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}>
              <div className="h-10 w-10 grid place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-red-500 text-white shadow">
                <ChefHat className="h-6 w-6" />
              </div>
            </motion.div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Spoon+Spark</h1>
            <Badge className="ml-1" variant="secondary">Beta</Badge>
          </div>

          <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
              <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search recipes (e.g., chicken, pasta, vegan)" className="pl-9" />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-40"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="time">Time (asc)</SelectItem>
                <SelectItem value="calories">Calories (asc)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="icon" onClick={() => setDark(!dark)} className="rounded-2xl">
              {dark ? <Sun className="h-5 w-5"/> : <Moon className="h-5 w-5"/>}
            </Button>
            <Button onClick={() => setShowAdd(true)} className="rounded-2xl">
              <Plus className="h-4 w-4 mr-1"/> Add Recipe
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3 flex gap-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
            <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search recipes..." className="pl-9" />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-36"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="time">Time (asc)</SelectItem>
              <SelectItem value="calories">Calories (asc)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Categories */}
        <div className="overflow-x-auto border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto px-4 py-2 flex gap-2">
            {CATEGORIES.map(c => (
              <Button key={c} variant={cat===c?"default":"secondary"} className="rounded-2xl" onClick={()=>setCat(c)}>
                {c}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto p-4">
        {filtered.length === 0 ? (
          <EmptyState query={query} onReset={()=>{setQuery(""); setCat("All");}} />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paged.map(r => (
                <RecipeCard key={r.id} recipe={r} onOpen={()=>setSelected(r)} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button variant="secondary" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="rounded-2xl">Prev</Button>
              <div className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-sm">Page {page} / {totalPages}</div>
              <Button variant="secondary" disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} className="rounded-2xl">Next</Button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="opacity-80">© {new Date().getFullYear()} Spoon+Spark. All rights reserved.</div>
          <div className="flex gap-2 opacity-80">
            <span>Built with ♥️ — Instant demo</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RecipeModal recipe={selected} onClose={()=>setSelected(null)} />
      <AddRecipe open={showAdd} onClose={()=>setShowAdd(false)} onCreate={(r)=>{ setRecipes(prev=>[{...r, id: String(Date.now())}, ...prev]); setShowAdd(false); }} />
    </div>
  );
}

function RecipeCard({ recipe, onOpen }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden rounded-2xl border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow cursor-pointer" onClick={onOpen}>
        <div className="aspect-video overflow-hidden">
          <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover hover:scale-105 transition-transform" />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between gap-2">
            <span className="line-clamp-1">{recipe.title}</span>
            <span className="flex items-center text-amber-500"><Star className="h-4 w-4 mr-1 fill-current" /> {recipe.rating}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          <div className="flex items-center justify-between text-sm opacity-80">
            <div className="flex items-center gap-1"><Clock className="h-4 w-4"/> {recipe.time} min</div>
            <div className="flex items-center gap-1"><Flame className="h-4 w-4"/> {recipe.calories} kcal</div>
            <Badge variant="outline" className="rounded-xl">{recipe.difficulty}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.tags.slice(0,3).map(t => <Badge key={t} variant="secondary" className="rounded-xl">{t}</Badge>)}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RecipeModal({ recipe, onClose }) {
  return (
    <AnimatePresence>
      {recipe && (
        <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="max-w-3xl w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
            <div className="relative">
              <img src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover" />
              <Button size="icon" variant="secondary" onClick={onClose} className="absolute top-3 right-3 rounded-2xl"><X className="h-5 w-5"/></Button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{recipe.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-sm opacity-80">
                    <Badge className="rounded-xl" variant="secondary">{recipe.category}</Badge>
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4"/> {recipe.time} min</div>
                    <div className="flex items-center gap-1"><Flame className="h-4 w-4"/> {recipe.calories} kcal</div>
                    <div className="flex items-center gap-1 text-amber-500"><Star className="h-4 w-4 fill-current"/> {recipe.rating}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Ingredients</h4>
                  <ul className="list-disc pl-5 space-y-1 opacity-90">
                    {recipe.ingredients.map((it, idx)=> <li key={idx}>{it}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Steps</h4>
                  <ol className="list-decimal pl-5 space-y-1 opacity-90">
                    {recipe.steps.map((s, idx)=> <li key={idx}>{s}</li>)}
                  </ol>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {recipe.tags.map(t => <Badge key={t} className="rounded-xl" variant="outline">#{t}</Badge>)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AddRecipe({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [time, setTime] = useState(20);
  const [difficulty, setDifficulty] = useState("Easy");
  const [calories, setCalories] = useState(400);
  const [rating, setRating] = useState(4.5);
  const [image, setImage] = useState("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop");
  const [tags, setTags] = useState("Quick, Home, Tasty");
  const [ingredients, setIngredients] = useState("1 cup something\n2 tsp something else");
  const [steps, setSteps] = useState("Step 1...\nStep 2...");

  if (!open) return null;

  const submit = () => {
    const recipe = {
      title: title.trim() || "Untitled Recipe",
      category,
      time: Number(time) || 0,
      difficulty,
      calories: Number(calories) || 0,
      rating: Number(rating) || 0,
      image,
      tags: tags.split(",").map(s=>s.trim()).filter(Boolean),
      ingredients: ingredients.split(/\n+/).filter(Boolean),
      steps: steps.split(/\n+/).filter(Boolean)
    };
    onCreate(recipe);
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="max-w-3xl w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 p-4">
            <h3 className="font-semibold text-lg flex items-center gap-2"><UtensilsCrossed className="h-5 w-5"/> Add a New Recipe</h3>
            <Button size="icon" variant="secondary" onClick={onClose} className="rounded-2xl"><X className="h-5 w-5"/></Button>
          </div>
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Title</Label>
                <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., Spicy Chicken Tacos" />
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter(c=>c!=="All" && c!=="Vegan" && c!=="Quick").map(c=> <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label>Time (min)</Label>
                  <Input type="number" value={time} onChange={e=>setTime(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Calories</Label>
                  <Input type="number" value={calories} onChange={e=>setCalories(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Rating</Label>
                  <Input type="number" step="0.1" value={rating} onChange={e=>setRating(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Easy','Medium','Hard'].map(d=> <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Cover Image URL</Label>
                <Input value={image} onChange={e=>setImage(e.target.value)} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Tags (comma separated)</Label>
                <Input value={tags} onChange={e=>setTags(e.target.value)} placeholder="Quick, Healthy, Vegan" />
              </div>
              <div className="space-y-1">
                <Label>Ingredients (one per line)</Label>
                <Textarea rows={6} value={ingredients} onChange={e=>setIngredients(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Steps (one per line)</Label>
                <Textarea rows={6} value={steps} onChange={e=>setSteps(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-zinc-200 dark:border-zinc-800 p-4">
            <Button variant="secondary" onClick={onClose} className="rounded-2xl">Cancel</Button>
            <Button onClick={submit} className="rounded-2xl"><Plus className="h-4 w-4 mr-1"/> Create</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function EmptyState({ query, onReset }) {
  return (
    <div className="py-24 text-center">
      <div className="mx-auto w-20 h-20 rounded-3xl grid place-items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 mb-4">
        <Search className="h-8 w-8 opacity-70" />
      </div>
      <h3 className="text-xl font-semibold">No recipes found</h3>
      <p className="opacity-80 max-w-md mx-auto mt-1">We couldn't find anything matching "{query}". Try a different keyword or reset your filters.</p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Button variant="secondary" onClick={onReset} className="rounded-2xl">Reset</Button>
      </div>
    </div>
  );
}
