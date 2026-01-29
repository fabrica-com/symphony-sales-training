import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { CategoryCard } from "@/components/category-card"
import { getAllCategories } from "@/lib/db/categories"

export default async function HomePage() {
  const categories = await getAllCategories()

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <section className="py-12">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-8 text-2xl font-bold">カリキュラム一覧</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
