import React, { useState } from 'react';
import { Meal } from '../types';
import { Carrot, Apple, Plus, Flame, Check, Sparkles, Scale } from 'lucide-react';

interface DietMenuTabProps {
  meals: Meal[];
  onToggleMeal: (id: string) => void;
  onAddMeal: (meal: Meal) => void;
}

export default function DietMenuTab({ meals, onToggleMeal, onAddMeal }: DietMenuTabProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('350');
  const [protein, setProtein] = useState('20');
  const [carbs, setCarbs] = useState('40');
  const [fat, setFat] = useState('10');
  const [category, setCategory] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Breakfast');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Random Unsplash healthy meal photo if not specified
    const mockImages = [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400'
    ];
    const image = mockImages[Math.floor(Math.random() * mockImages.length)];

    onAddMeal({
      id: `meal-${Date.now()}`,
      name,
      calories: parseInt(calories, 10) || 300,
      protein: parseInt(protein, 10) || 15,
      carbs: parseInt(carbs, 10) || 35,
      fat: parseInt(fat, 10) || 8,
      category,
      logged: false,
      image
    });

    setName('');
    setShowAddModal(false);
  };

  // Summarize nutritional totals for logged meals
  const loggedMeals = meals.filter(m => m.logged);
  const totalCalories = loggedMeals.reduce((acc, curr) => acc + curr.calories, 0);
  const totalProtein = loggedMeals.reduce((acc, curr) => acc + curr.protein, 0);
  const totalCarbs = loggedMeals.reduce((acc, curr) => acc + curr.carbs, 0);
  const totalFat = loggedMeals.reduce((acc, curr) => acc + curr.fat, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Diet Food Menu</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Browse and log healthy fitness meal programs to manage your caloric intake and protein objectives.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log Custom Meal
        </button>
      </div>

      {/* Stats Summary Ring Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/20 text-orange-500">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Calories</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-mono">{totalCalories} kcal</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Protein Total</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-mono">{totalProtein}g</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/20 text-blue-500">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Carbs</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-mono">{totalCarbs}g</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/20 text-pink-500">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fat Burn Ratio</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-mono">{totalFat}g</span>
          </div>
        </div>
      </div>

      {/* Meal Category Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map((cat) => {
          const catMeals = meals.filter(m => m.category === cat);

          return (
            <div key={cat} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-2.5">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {cat}
                </h3>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                  {catMeals.length} available
                </span>
              </div>

              <div className="space-y-4">
                {catMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    {/* Meal Image */}
                    <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-slate-950/75 text-white backdrop-blur-sm text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest font-mono">
                        {meal.calories} kcal
                      </span>
                    </div>

                    {/* Meal Details */}
                    <div className="p-4">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight truncate">
                        {meal.name}
                      </span>

                      {/* Macronutrients ratios */}
                      <div className="grid grid-cols-3 gap-2 mt-3 mb-4 text-center">
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded-xl border border-slate-100/30 dark:border-slate-800/20">
                          <span className="block text-[8px] font-bold text-slate-400 uppercase">Protein</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{meal.protein}g</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded-xl border border-slate-100/30 dark:border-slate-800/20">
                          <span className="block text-[8px] font-bold text-slate-400 uppercase">Carbs</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{meal.carbs}g</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded-xl border border-slate-100/30 dark:border-slate-800/20">
                          <span className="block text-[8px] font-bold text-slate-400 uppercase">Fat</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{meal.fat}g</span>
                        </div>
                      </div>

                      {/* Log meal button */}
                      <button
                        onClick={() => onToggleMeal(meal.id)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                          meal.logged
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
                            : 'bg-slate-950 dark:bg-slate-800 text-white dark:hover:bg-slate-700 border-transparent hover:bg-slate-800'
                        }`}
                      >
                        {meal.logged ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Logged Today
                          </>
                        ) : (
                          <>Log Intake</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Custom Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-scale-up">
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Carrot className="text-emerald-500 w-5 h-5" />
              Log Custom Food Meal
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
              Log calories and macronutrients of food intake to update daily metrics.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                  Meal Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  placeholder="e.g. Protein shake with oats, Baked chicken breast"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="2000"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1.5">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="150"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  Log Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
