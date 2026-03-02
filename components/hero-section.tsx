import { BookOpen, Users, Clock, Target } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="border-b border-border bg-linear-to-b from-secondary/50 to-background py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center">
          <Image
            src="/symphony-logo.svg"
            alt="Symphony営業研修プログラム"
            width={400}
            height={60}
            className="mx-auto h-auto w-full max-w-md"
          />
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            新卒からマネージャーまで、体系的に学べる営業力強化プログラム。
            <br className="hidden md:block" />
            ミニ研修100本で即戦力を育成します。
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-2xl font-bold">100本</p>
            <p className="text-sm text-muted-foreground">ミニ研修</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Target className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-2xl font-bold">10</p>
            <p className="text-sm text-muted-foreground">カテゴリ</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Clock className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-2xl font-bold">15-30分</p>
            <p className="text-sm text-muted-foreground">1本あたり</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <Users className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-2 text-2xl font-bold">5段階</p>
            <p className="text-sm text-muted-foreground">レベル別</p>
          </div>
        </div>
      </div>
    </section>
  )
}
