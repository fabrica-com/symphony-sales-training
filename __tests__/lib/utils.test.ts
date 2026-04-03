import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("utils.ts", () => {
  describe("cn - クラスマージ関数", () => {
    it("単一のクラスを返す", () => {
      expect(cn("px-2")).toBe("px-2")
    })

    it("複数のクラスを結合する", () => {
      expect(cn("px-2", "py-4")).toBe("px-2 py-4")
    })

    it("条件付きクラスを正しく処理", () => {
      const isActive = true
      const result = cn("base", isActive && "active")
      expect(result).toBe("base active")
    })

    it("条件付きクラスが false の場合は除外", () => {
      const isActive = false
      const result = cn("base", isActive && "active")
      expect(result).toBe("base")
    })

    it("Tailwind クラスの競合を解決（後のクラスが優先）", () => {
      // tailwind-merge は同じプロパティを持つクラスを競合させて、後のものを優先する
      const result = cn("px-2", "px-4")
      expect(result).toContain("px-4")
      expect(result).not.toContain("px-2")
    })

    it("オブジェクト形式のクラス定義を処理", () => {
      const result = cn({
        "px-2": true,
        "py-4": false,
        "text-red-500": true,
      })
      expect(result).toContain("px-2")
      expect(result).toContain("text-red-500")
      expect(result).not.toContain("py-4")
    })

    it("配列形式のクラス定義を処理", () => {
      const result = cn(["px-2", "py-4"])
      expect(result).toContain("px-2")
      expect(result).toContain("py-4")
    })

    it("複数の競合クラスで最後のものが適用される", () => {
      const result = cn("text-red-500", "text-blue-600", "text-green-700")
      expect(result).toContain("text-green-700")
      expect(result).not.toContain("text-red-500")
      expect(result).not.toContain("text-blue-600")
    })

    it("空のクラスは除外される", () => {
      const result = cn("px-2", "", "py-4", null, undefined)
      expect(result).toBe("px-2 py-4")
    })

    it("複雑な条件付きロジック", () => {
      const isDisabled = false
      const isLoading = true
      const result = cn(
        "btn",
        isDisabled && "opacity-50 cursor-not-allowed",
        isLoading && "animate-pulse"
      )
      expect(result).toContain("btn")
      expect(result).toContain("animate-pulse")
      expect(result).not.toContain("opacity-50")
    })

    it("引数なしで空文字列を返す", () => {
      expect(cn()).toBe("")
    })

    it("bg-color の競合を正しく解決", () => {
      const result = cn("bg-red-500", "bg-blue-600")
      expect(result).toContain("bg-blue-600")
      expect(result).not.toContain("bg-red-500")
    })

    it("margin/padding の競合を正しく解決", () => {
      const result = cn("m-2", "m-4", "p-2", "p-8")
      expect(result).toContain("m-4")
      expect(result).toContain("p-8")
      expect(result).not.toContain("m-2")
      expect(result).not.toContain("p-2")
    })

    it("width クラスの競合を解決", () => {
      const result = cn("w-1/2", "w-full")
      expect(result).toContain("w-full")
      expect(result).not.toContain("w-1/2")
    })

    it("display クラスの競合を解決", () => {
      const result = cn("flex", "grid")
      expect(result).toContain("grid")
      expect(result).not.toContain("flex")
    })

    it("複数の Tailwind セットから最終的なクラスセットを返す", () => {
      const baseClasses = "px-4 py-2 rounded"
      const variantClasses = "bg-blue-600 text-white"
      const hoverClasses = "hover:bg-blue-700"

      const result = cn(baseClasses, variantClasses, hoverClasses)

      expect(result).toContain("px-4")
      expect(result).toContain("py-2")
      expect(result).toContain("rounded")
      expect(result).toContain("bg-blue-600")
      expect(result).toContain("text-white")
      expect(result).toContain("hover:bg-blue-700")
    })
  })
})
