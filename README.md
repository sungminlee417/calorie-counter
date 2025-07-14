# 🥗 Calorie Counter

A simple macro tracking app built with **Next.js** and **Supabase**.

Users can:

- Set daily **macro goals** (protein, fat, carbs)
- Log **foods** with nutritional info
- Add **food entries** for specific dates
- Track daily intake with dynamic progress visualizations

---

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router)
- **Backend**: [Supabase](https://supabase.com/)
- **Database**: Postgres (via Supabase)
- **UI**: MUI (Material UI)

---

## 📦 Features

### ✅ Macro Goals

- Set daily targets for:
  - Protein
  - Fat
  - Carbs
- Calories are auto-calculated using standard macros:
  calories = (protein _ 4) + (carbs _ 4) + (fat \* 9)

### 🍎 Foods

- Create foods with nutritional values
- Nutrients include:
- Calories
- Protein (g)
- Fat (g)
- Carbs (g)

### 📝 Food Entries

- Log food entries per day
- Automatically calculates total intake for:
- Calories
- Macronutrients
- Visual chart with daily breakdown + progress against goals

---

## 📸 Screenshots

---

## 🛠️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/sungminlee417/calorie-counter.git
cd calorie-counter

```

### 2. Install dependencies

`npm install`

### 3. Set up environment variables

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can find these in your Supabase project's Settings → API.

## 🧾 Database Schema

This app uses **three main tables** in Supabase:

---

### 📘 `foods`

Stores the nutritional information of each food item.

| Column     | Type    | Description       |
| ---------- | ------- | ----------------- |
| `id`       | integer | Primary key       |
| `name`     | text    | Name of the food  |
| `calories` | number  | Calories per unit |
| `protein`  | number  | Protein in grams  |
| `fat`      | number  | Fat in grams      |
| `carbs`    | number  | Carbs in grams    |

---

### 📗 `food_entries`

Logs each food entry for a specific user and date.

| Column     | Type    | Description                       |
| ---------- | ------- | --------------------------------- |
| `id`       | integer | Primary key                       |
| `user_id`  | uuid    | Foreign key → Auth users          |
| `food_id`  | integer | Foreign key → `foods.id`          |
| `quantity` | number  | Quantity consumed (e.g. servings) |
| `date`     | date    | Date of consumption               |

> ⚠️ RLS (Row-Level Security) ensures that users can only view and modify their own food entries.

---

### 📕 `macro_goals`

Stores each user's daily macro goal.

| Column     | Type    | Description                            |
| ---------- | ------- | -------------------------------------- |
| `id`       | integer | Primary key                            |
| `user_id`  | uuid    | Foreign key → Auth users               |
| `protein`  | number  | Target grams of protein per day        |
| `fat`      | number  | Target grams of fat per day            |
| `carbs`    | number  | Target grams of carbs per day          |
| `calories` | number  | Auto-calculated from protein/fat/carbs |

> 🧠 Calories are calculated using:
>
> ```
> calories = (protein * 4) + (carbs * 4) + (fat * 9)
> ```

---

## 🔐 Auth & Security

- ✅ **Supabase Auth** is used to manage users (email login / magic links)
- ✅ **Row-Level Security (RLS)** is enabled for all user-specific tables
- ✅ Each table has policies to ensure users can only access their own data

---

## 🧪 TODOs & Future Ideas

- Add authentication UI (login/register)
- Add ability to search or import foods
- Add weekly/monthly summaries
- Add dark mode toggle
- Export data to CSV or PDF
- Mobile-first layout polish

---

## 📄 License

This project is open-source and licensed under the **MIT License**.

---

## 🙌 Acknowledgments

- [Supabase](https://supabase.com) — the open-source Firebase alternative
- [Next.js](https://nextjs.org) — React framework for building fast apps
- [MUI](https://mui.com) — beautiful and customizable React UI components

---

## ✨ Contributing

Have ideas for improvements?
Pull requests are welcome!

To contribute:

1. Fork the repo
2. Create a branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push and open a PR 🚀
