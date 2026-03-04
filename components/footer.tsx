export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <span className="text-sm font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-sm font-medium">symphony 事業部</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} 株式会社ファブリカコミュニケーションズ
          </p>
        </div>
      </div>
    </footer>
  )
}
