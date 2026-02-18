import Link from "next/link"
import { ArrowLeft, BookOpen, TrendingUp, Building2, Truck, ShoppingCart, Lightbulb, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Props {
  category: { id: string; name: string }
}

/** DB 用 HTML 出力・表示用。Header/Footer なしの本文のみ */
export function CategoryCDeepDiveBody({ category }: Props) {
  return (
    <>
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-amber-50 to-background py-12">
          <div className="mx-auto max-w-4xl px-4">
            <Link
              href={`/category/${category.id}`}
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {category.name}に戻る
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-amber-500 text-white">
                <BookOpen className="h-8 w-8" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">深掘りテキスト</Badge>
                <h1 className="text-3xl font-bold">中古車流通の構造と現状</h1>
                <p className="mt-2 text-muted-foreground">Symphony営業担当者のための業界深掘りテキスト</p>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="border-b border-border bg-secondary/30 py-8">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="mb-4 text-lg font-semibold">目次</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href="#chapter1" className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-amber-500 transition-colors">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">第1章：中古車流通市場の全体像</span>
              </a>
              <a href="#chapter2" className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-amber-500 transition-colors">
                <Truck className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">第2章：仕入れ構造の詳細分析</span>
              </a>
              <a href="#chapter3" className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-amber-500 transition-colors">
                <ShoppingCart className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">第3章：在庫から販売までのプロセス</span>
              </a>
              <a href="#chapter4" className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 hover:border-amber-500 transition-colors">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-medium">第4章：流通における課題と変革</span>
              </a>
            </div>
          </div>
        </section>

        {/* Content */}
        <article className="py-12">
          <div className="mx-auto max-w-4xl px-4">
            
            {/* Chapter 1 */}
            <section id="chapter1" className="mb-16 scroll-mt-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">第1章：中古車流通市場の全体像</h2>
              </div>

              <div className="space-y-8">
                {/* 1.1 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">1.1 市場規模と経済的位置づけ</h3>
                  
                  <h4 className="mb-3 font-semibold text-amber-600">国内中古車市場の規模</h4>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    日本の中古車市場は、新車市場を凌駕する巨大なマーケットです。2023年の統計によれば、中古車登録台数は約695万台に達し、新車販売台数（約478万台）の約1.45倍の規模を誇ります。金額ベースでは、中古車小売市場は約4兆円規模と推計され、関連サービス（整備、保険、ローン等）を含めると約7兆円の経済圏を形成しています。
                  </p>

                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <caption className="mb-2 text-left font-medium">中古車・新車販売台数の推移（万台）</caption>
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-2 text-left">年度</th>
                          <th className="px-4 py-2 text-right">中古車</th>
                          <th className="px-4 py-2 text-right">新車</th>
                          <th className="px-4 py-2 text-right">比率</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2">2019年</td>
                          <td className="px-4 py-2 text-right">693</td>
                          <td className="px-4 py-2 text-right">520</td>
                          <td className="px-4 py-2 text-right">1.33</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2">2020年</td>
                          <td className="px-4 py-2 text-right">649</td>
                          <td className="px-4 py-2 text-right">460</td>
                          <td className="px-4 py-2 text-right">1.41</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2">2021年</td>
                          <td className="px-4 py-2 text-right">671</td>
                          <td className="px-4 py-2 text-right">445</td>
                          <td className="px-4 py-2 text-right">1.51</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2">2022年</td>
                          <td className="px-4 py-2 text-right">686</td>
                          <td className="px-4 py-2 text-right">456</td>
                          <td className="px-4 py-2 text-right">1.50</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">2023年</td>
                          <td className="px-4 py-2 text-right font-medium">695</td>
                          <td className="px-4 py-2 text-right font-medium">478</td>
                          <td className="px-4 py-2 text-right font-medium">1.45</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-2 text-xs text-muted-foreground">※中古車は登録車+軽自動車の合計　※出典：日本自動車販売協会連合会、全国軽自動車協会連合会</p>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-4">
                    <p className="text-sm leading-relaxed">
                      <strong>注目ポイント：</strong>コロナ禍（2020-2021年）において新車の供給が半導体不足等により制約を受けた際、中古車への代替需要が顕在化し、中古車価格の高騰という現象が発生しました。これは中古車市場が単なる「新車の受け皿」ではなく、独立した市場として機能していることを示しています。
                    </p>
                  </div>
                </div>

                {/* 経済的意義 */}
                <div className="rounded-lg border border-border p-6">
                  <h4 className="mb-4 font-semibold text-amber-600">中古車流通の経済的意義</h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold text-sm">1</div>
                      <div>
                        <h5 className="font-medium">資産の有効活用</h5>
                        <p className="mt-1 text-sm text-muted-foreground">自動車は住宅に次ぐ高額耐久消費財です。中古車流通が存在することで、車両の経済的寿命が延長され、資源の有効活用が図られます。日本では平均車齢（初度登録からの経過年数）が13.84年（2023年）に達しています。</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold text-sm">2</div>
                      <div>
                        <h5 className="font-medium">消費者の選択肢拡大</h5>
                        <p className="mt-1 text-sm text-muted-foreground">中古車市場の存在により、消費者は予算や用途に応じて幅広い選択肢から車両を選ぶことができます。新車では手が届かない上位車種や、すでに生産終了したモデルを入手することも可能です。</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 font-bold text-sm">3</div>
                      <div>
                        <h5 className="font-medium">地域経済への貢献</h5>
                        <p className="mt-1 text-sm text-muted-foreground">全国に約5万店舗存在する中古車販売店は、その多くが地域密着型の中小企業です。これらの事業者は地域の雇用を支え、整備業、保険業、金融業など関連産業への波及効果も大きいです。</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1.2 流通構造 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">1.2 流通構造の全体像</h3>
                  
                  <h4 className="mb-3 font-semibold text-amber-600">サプライチェーンとしての中古車流通</h4>
                  <p className="mb-4 leading-relaxed text-muted-foreground">
                    中古車流通は、製造業における原材料調達から製品販売までのサプライチェーンに類似した構造を持ちます。ただし、「原材料」に相当する中古車は、新車ディーラー、一般消費者、レンタカー会社、リース会社など多様なソースから発生する点が特徴的です。
                  </p>

                  <div className="mb-6 rounded-lg bg-secondary/50 p-4">
                    <h5 className="mb-3 font-medium">流通経路別のボリューム</h5>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded bg-amber-500"></div>
                        <span className="font-medium">オートオークション経由（約70%）</span>
                      </div>
                      <p className="ml-7 text-sm text-muted-foreground">全国に約130会場が存在し、年間約700万台が取引されます。価格形成の透明性、品質の標準化、取引の効率性、信用リスクの軽減が特徴です。</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded bg-amber-400"></div>
                        <span className="font-medium">下取り・買取による直接仕入れ（約20%）</span>
                      </div>
                      <p className="ml-7 text-sm text-muted-foreground">オークション手数料が不要で、現車確認が確実。顧客関係の構築にも繋がりますが、希望車種が入庫する保証がないのが課題です。</p>
                      
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded bg-amber-300"></div>
                        <span className="font-medium">業販プラットフォーム経由（約10%）</span>
                      </div>
                      <p className="ml-7 text-sm text-muted-foreground">販売店間の直接取引を仲介するB2Bプラットフォームであり、近年成長が著しい分野です。シンフォニーワンプラ、オートサーバー、オークネットなどが代表的なサービスです。</p>
                    </div>
                  </div>
                </div>

                {/* 1.3 主要プレイヤー */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">1.3 主要プレイヤーの分析</h3>
                  
                  <h4 className="mb-3 font-semibold text-amber-600">オートオークション会社</h4>
                  <div className="mb-6 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-2 text-left">会社名</th>
                          <th className="px-4 py-2 text-right">会場数</th>
                          <th className="px-4 py-2 text-right">年間取引台数</th>
                          <th className="px-4 py-2 text-left">特徴</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">USS</td>
                          <td className="px-4 py-2 text-right">19会場</td>
                          <td className="px-4 py-2 text-right">約250万台</td>
                          <td className="px-4 py-2 text-muted-foreground">業界最大手、東証プライム上場</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2 font-medium">JU（中販連系）</td>
                          <td className="px-4 py-2 text-right">約50会場</td>
                          <td className="px-4 py-2 text-right">約150万台</td>
                          <td className="px-4 py-2 text-muted-foreground">業界団体系、地域密着</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">TAA（トヨタ系）</td>
                          <td className="px-4 py-2 text-right">8会場</td>
                          <td className="px-4 py-2 text-right">約80万台</td>
                          <td className="px-4 py-2 text-muted-foreground">トヨタ系ディーラー出品中心</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2 font-medium">HAA神戸</td>
                          <td className="px-4 py-2 text-right">2会場</td>
                          <td className="px-4 py-2 text-right">約40万台</td>
                          <td className="px-4 py-2 text-muted-foreground">関西圏に強み</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h4 className="mb-3 font-semibold text-amber-600">中古車販売店の分類</h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <h5 className="font-medium">大規模チェーン</h5>
                      <p className="text-xs text-muted-foreground">在庫100台以上</p>
                      <p className="mt-2 text-sm">店舗数では全体の1%未満だが、販売台数では約15%を占めます。</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <h5 className="font-medium">中規模店</h5>
                      <p className="text-xs text-muted-foreground">在庫30〜100台</p>
                      <p className="mt-2 text-sm">全体の約5%。整備工場を併設し、ワンストップサービスを提供。</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-4">
                      <h5 className="font-medium">小規模店</h5>
                      <p className="text-xs text-muted-foreground">在庫30台未満</p>
                      <p className="mt-2 text-sm">全国の約95%を占め、家族経営や個人事業主が中心。</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Chapter 2 */}
            <section id="chapter2" className="mb-16 scroll-mt-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <Truck className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">第2章：仕入れ構造の詳細分析</h2>
              </div>

              <div className="space-y-8">
                {/* 2.1 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">2.1 オートオークションの機能と役割</h3>
                  
                  <h4 className="mb-3 font-semibold text-amber-600">市場としてのオークション</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <h5 className="font-medium">価格発見機能</h5>
                      <p className="mt-1 text-sm text-muted-foreground">競争入札により、需要と供給が均衡する価格が発見されます。この価格は「相場」として業界全体で参照されます。</p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <h5 className="font-medium">流動性供給機能</h5>
                      <p className="mt-1 text-sm text-muted-foreground">売りたい時に売れる、買いたい時に買える「流動性」を提供します。</p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <h5 className="font-medium">品質保証機能</h5>
                      <p className="mt-1 text-sm text-muted-foreground">検査員による評価点付けにより、品質に関する情報の非対称性を軽減します。</p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <h5 className="font-medium">決済保証機能</h5>
                      <p className="mt-1 text-sm text-muted-foreground">オークション会社が売り手と買い手の間に入り、代金決済を保証します。</p>
                    </div>
                  </div>
                </div>

                {/* 評価点 */}
                <div className="rounded-lg border border-border p-6">
                  <h4 className="mb-4 font-semibold text-amber-600">評価点制度の詳細</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-2 text-left">評価点</th>
                          <th className="px-4 py-2 text-left">状態</th>
                          <th className="px-4 py-2 text-left">特徴</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">S点</td>
                          <td className="px-4 py-2">新車に準ずる</td>
                          <td className="px-4 py-2 text-muted-foreground">走行距離1万km未満、内外装に目立つ傷なし</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2 font-medium">6点</td>
                          <td className="px-4 py-2">非常に良い</td>
                          <td className="px-4 py-2 text-muted-foreground">走行距離3万km未満、小売でそのまま販売可能</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">5点</td>
                          <td className="px-4 py-2">状態が良い</td>
                          <td className="px-4 py-2 text-muted-foreground">走行距離5万km未満、標準的な中古車</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2 font-medium">4.5点</td>
                          <td className="px-4 py-2">やや良い</td>
                          <td className="px-4 py-2 text-muted-foreground">走行距離10万km未満、補修すれば小売可能</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">4点</td>
                          <td className="px-4 py-2">標準的</td>
                          <td className="px-4 py-2 text-muted-foreground">走行距離制限なし、補修費用を考慮した仕入れが必要</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2 font-medium">3.5点</td>
                          <td className="px-4 py-2">やや劣る</td>
                          <td className="px-4 py-2 text-muted-foreground">傷・へこみが多い、業販・輸出向け</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">R点</td>
                          <td className="px-4 py-2">修復歴あり</td>
                          <td className="px-4 py-2 text-muted-foreground">骨格部分の修復履歴あり</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 rounded-lg bg-amber-50 p-4">
                    <p className="text-sm">
                      <strong>価格への影響：</strong>一般的に、評価点が0.5ポイント上がると、同一車種・同一年式で5〜10%程度価格が上昇する傾向があります。
                    </p>
                  </div>
                </div>

                {/* 2.2 下取り・買取 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">2.2 下取り・買取の構造</h3>
                  
                  <div className="mb-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <h5 className="font-medium text-amber-600">下取り</h5>
                      <p className="mt-2 text-sm text-muted-foreground">車両購入時に現有車を販売店に売却。購入車両とのパッケージで交渉されることが多い。</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <h5 className="font-medium text-amber-600">買取</h5>
                      <p className="mt-2 text-sm text-muted-foreground">車両売却のみを目的とした取引。車両の市場価値のみで価格が決定される。</p>
                    </div>
                  </div>

                  <h4 className="mb-3 font-semibold">査定価格の算出方法</h4>
                  <div className="rounded-lg bg-secondary/50 p-4 font-mono text-sm">
                    <p>査定価格 = 基本価値 − 減価額 − 利益マージン − リスクバッファ</p>
                    <p className="mt-2 text-muted-foreground">※利益マージン：5〜15%　※リスクバッファ：3〜5%</p>
                  </div>
                </div>

                {/* 2.3 業販 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">2.3 業販プラットフォームの台頭</h3>
                  
                  <p className="mb-4 text-muted-foreground">
                    「業販（ぎょうはん）」とは、業者間販売の略称であり、中古車販売店同士が直接取引を行う形態を指します。2000年代以降のインターネット普及に伴い、オンラインプラットフォームによる業販が急速に発展しました。
                  </p>

                  <h4 className="mb-3 font-semibold text-amber-600">シンフォニーワンプラの競争優位性</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">1</div>
                      <div>
                        <h5 className="font-medium">販売管理システムとの垂直統合</h5>
                        <p className="text-sm text-muted-foreground">Symphony販売管理を利用する販売店は、在庫データを自動でワンプラに連携。出品作業が数分で完了します。</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">2</div>
                      <div>
                        <h5 className="font-medium">陸送ネットワークとの連携</h5>
                        <p className="text-sm text-muted-foreground">提携陸送会社とのシステム連携により、落札後の陸送手配がスムーズ。料金の透明性も高いです。</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">3</div>
                      <div>
                        <h5 className="font-medium">品質保証制度</h5>
                        <p className="text-sm text-muted-foreground">出品車両に対する検査基準を設け、トラブルを防止する仕組みを構築しています。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Chapter 3 */}
            <section id="chapter3" className="mb-16 scroll-mt-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">第3章：在庫から販売までのプロセス</h2>
              </div>

              <div className="space-y-8">
                {/* 3.1 商品化 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">3.1 商品化工程の詳細</h3>
                  
                  <p className="mb-4 text-muted-foreground">
                    「商品化」とは、仕入れた車両を販売可能な状態に仕上げる一連の作業を指します。この工程の品質が、販売価格と成約率に直結します。
                  </p>

                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">1</div>
                      <div>
                        <span className="font-medium">入庫検査（30分）</span>
                        <span className="ml-2 text-sm text-muted-foreground">外装・内装の状態確認、機関チェック</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">2</div>
                      <div>
                        <span className="font-medium">整備計画（15分）</span>
                        <span className="ml-2 text-sm text-muted-foreground">必要な整備項目の洗い出し、部品発注</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">3</div>
                      <div>
                        <span className="font-medium">整備（2〜8時間）</span>
                        <span className="ml-2 text-sm text-muted-foreground">法定点検項目、消耗品交換、不具合修理</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">4</div>
                      <div>
                        <span className="font-medium">板金塗装（必要時）</span>
                        <span className="ml-2 text-sm text-muted-foreground">傷の補修、へこみの修理</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">5</div>
                      <div>
                        <span className="font-medium">クリーニング（1〜2時間）</span>
                        <span className="ml-2 text-sm text-muted-foreground">外装洗車・コーティング、内装清掃・消臭</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">6</div>
                      <div>
                        <span className="font-medium">写真撮影・掲載（1時間）</span>
                        <span className="ml-2 text-sm text-muted-foreground">外装・内装の撮影、車両情報の入力</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="mb-3 font-semibold text-amber-600">商品化コストの構造</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-2 text-left">コスト項目</th>
                          <th className="px-4 py-2 text-right">50万円以下</th>
                          <th className="px-4 py-2 text-right">50〜100万円</th>
                          <th className="px-4 py-2 text-right">100〜200万円</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2">点検整備費</td>
                          <td className="px-4 py-2 text-right">15,000円</td>
                          <td className="px-4 py-2 text-right">25,000円</td>
                          <td className="px-4 py-2 text-right">35,000円</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2">消耗品交換</td>
                          <td className="px-4 py-2 text-right">10,000円</td>
                          <td className="px-4 py-2 text-right">15,000円</td>
                          <td className="px-4 py-2 text-right">20,000円</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2">板金・塗装（平均）</td>
                          <td className="px-4 py-2 text-right">20,000円</td>
                          <td className="px-4 py-2 text-right">25,000円</td>
                          <td className="px-4 py-2 text-right">30,000円</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2">クリーニング</td>
                          <td className="px-4 py-2 text-right">5,000円</td>
                          <td className="px-4 py-2 text-right">8,000円</td>
                          <td className="px-4 py-2 text-right">10,000円</td>
                        </tr>
                        <tr className="border-b border-border font-medium">
                          <td className="px-4 py-2">合計（平均）</td>
                          <td className="px-4 py-2 text-right">53,000円</td>
                          <td className="px-4 py-2 text-right">76,000円</td>
                          <td className="px-4 py-2 text-right">100,000円</td>
                        </tr>
                        <tr className="bg-amber-50">
                          <td className="px-4 py-2 font-medium">対車両価格比</td>
                          <td className="px-4 py-2 text-right font-medium text-amber-600">10.6%</td>
                          <td className="px-4 py-2 text-right font-medium text-amber-600">7.6%</td>
                          <td className="px-4 py-2 text-right font-medium text-amber-600">5.0%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3.2 価格設定 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">3.2 価格設定のメカニズム</h3>
                  
                  <div className="mb-4 rounded-lg bg-secondary/50 p-4 font-mono text-sm">
                    <p className="font-medium">販売価格 = 仕入れコスト + 商品化コスト + 目標粗利 + 価格調整</p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>・仕入れコスト：車両価格 + 手数料 + 陸送費 + 消費税</li>
                      <li>・商品化コスト：整備費 + 板金費 + クリーニング費 + 撮影費</li>
                      <li>・目標粗利：仕入れコストの10〜25%（店舗方針による）</li>
                    </ul>
                  </div>

                  <h4 className="mb-3 font-semibold text-amber-600">在庫日数と価格調整</h4>
                  <p className="mb-3 text-sm text-muted-foreground">
                    在庫として滞留する期間が長くなると、相場下落リスク、資金固定リスク、陳腐化リスクが増大します。そのため、在庫日数に応じた価格調整ルールを設けている販売店が多いです。
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-2 text-left">在庫日数</th>
                          <th className="px-4 py-2 text-left">価格調整</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2">0〜30日</td>
                          <td className="px-4 py-2">販売価格維持</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2">31〜60日</td>
                          <td className="px-4 py-2">5%値下げ</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2">61〜90日</td>
                          <td className="px-4 py-2">10%値下げ</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2">91〜120日</td>
                          <td className="px-4 py-2">15%値下げ or 業販出品</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2">121日以上</td>
                          <td className="px-4 py-2">業販 or オークション再出品</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* Chapter 4 */}
            <section id="chapter4" className="mb-16 scroll-mt-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">第4章：流通における課題と変革</h2>
              </div>

              <div className="space-y-8">
                {/* 4.1 構造的課題 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">4.1 構造的課題</h3>
                  
                  <h4 className="mb-3 font-semibold text-amber-600">情報の非対称性</h4>
                  <div className="mb-4 space-y-3">
                    <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
                      <h5 className="font-medium">品質に関する非対称性</h5>
                      <p className="mt-1 text-sm text-muted-foreground">売り手（販売店）は車両の状態を熟知しているが、買い手（消費者）は限定的な情報しか持たない。消費者の不信感やレモン問題を引き起こします。</p>
                    </div>
                    <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
                      <h5 className="font-medium">価格に関する非対称性</h5>
                      <p className="mt-1 text-sm text-muted-foreground">オークション相場や業者間価格は、一般消費者にはアクセスしにくい。提示された価格が適正かどうかの判断が困難です。</p>
                    </div>
                  </div>

                  <h4 className="mb-3 font-semibold text-amber-600">人手不足と生産性</h4>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <h5 className="font-medium text-sm">営業職</h5>
                      <p className="mt-1 text-xs text-muted-foreground">若年層の応募減少、「営業＝ノルマ」のネガティブイメージ</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <h5 className="font-medium text-sm">整備士</h5>
                      <p className="mt-1 text-xs text-muted-foreground">資格保有者の減少、給与水準の低さ（平均年収約380万円）</p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <h5 className="font-medium text-sm">事務職</h5>
                      <p className="mt-1 text-xs text-muted-foreground">登録業務の煩雑さ、ITリテラシーの必要性向上</p>
                    </div>
                  </div>
                </div>

                {/* 4.2 DX */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">4.2 テクノロジーによる変革</h3>
                  
                  <h4 className="mb-3 font-semibold text-amber-600">DX（デジタルトランスフォーメーション）の進展</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <h5 className="font-medium">仕入れのデジタル化</h5>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>・オンラインオークション（衛星入札、TV入札）</li>
                        <li>・業販プラットフォームの普及</li>
                        <li>・AI相場予測ツールの登場</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <h5 className="font-medium">在庫管理のシステム化</h5>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>・クラウド型在庫管理システム</li>
                        <li>・在庫回転率のリアルタイム可視化</li>
                        <li>・長期在庫アラート機能</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <h5 className="font-medium">販売のオンライン化</h5>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>・オンライン商談（Zoom等）</li>
                        <li>・VR/360度画像による遠隔確認</li>
                        <li>・非対面契約の普及</li>
                      </ul>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <h5 className="font-medium">顧客管理のCRM化</h5>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <li>・顧客データベースの構築</li>
                        <li>・車検・点検リマインドの自動化</li>
                        <li>・購買履歴に基づくアプローチ</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Symphonyシリーズ */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
                  <h4 className="mb-4 font-semibold text-amber-600">Symphonyシリーズが提供する価値</h4>
                  <p className="mb-4 text-sm text-muted-foreground">
                    ファブリカホールディングスのSymphonyシリーズは、上記のDX領域をカバーする統合ソリューションです。
                  </p>
                  <div className="space-y-3">
                    <div className="rounded-lg bg-background p-4">
                      <h5 className="font-medium">Symphony販売管理</h5>
                      <p className="mt-1 text-sm text-muted-foreground">在庫管理、顧客管理、帳票出力、分析機能を一元管理</p>
                    </div>
                    <div className="rounded-lg bg-background p-4">
                      <h5 className="font-medium">Symphony整備請求</h5>
                      <p className="mt-1 text-sm text-muted-foreground">整備見積、請求管理、車検リマインド、整備履歴管理</p>
                    </div>
                    <div className="rounded-lg bg-background p-4">
                      <h5 className="font-medium">シンフォニーワンプラ</h5>
                      <p className="mt-1 text-sm text-muted-foreground">業販仕入れ・販売、陸送手配、Symphony連携による自動データ連携</p>
                    </div>
                  </div>
                </div>

                {/* 4.3 今後の展望 */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="mb-4 text-xl font-semibold">4.3 今後の展望</h3>
                  
                  <h4 className="mb-3 font-semibold text-amber-600">市場構造の変化予測</h4>
                  <div className="mb-6 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">1</div>
                      <div>
                        <h5 className="font-medium">オンライン取引の拡大</h5>
                        <p className="text-sm text-muted-foreground">コロナ禍を契機に加速したオンライン化は、今後も継続。遠方の顧客への販売、業者間取引のオンライン化が進む。</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">2</div>
                      <div>
                        <h5 className="font-medium">業界再編の加速</h5>
                        <p className="text-sm text-muted-foreground">大手チェーンの拡大と中小販売店の淘汰が進む可能性。一方で、専門性や地域密着を強みとする中小店舗が生き残る道も。</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold">3</div>
                      <div>
                        <h5 className="font-medium">EVシフトへの対応</h5>
                        <p className="text-sm text-muted-foreground">EV（電気自動車）の普及に伴い、中古EV市場も拡大。バッテリー評価、整備体制など、新たな対応が求められる。</p>
                      </div>
                    </div>
                  </div>

                  <h4 className="mb-3 font-semibold text-amber-600">販売店の生き残り戦略</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="px-4 py-2 text-left">戦略領域</th>
                          <th className="px-4 py-2 text-left">具体的施策</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">デジタル化</td>
                          <td className="px-4 py-2 text-muted-foreground">業務システムの導入（Symphony等）、オンライン集客の強化、データに基づく経営判断</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2 font-medium">顧客関係強化</td>
                          <td className="px-4 py-2 text-muted-foreground">整備・車検を通じた継続接点、CRMによる顧客管理、紹介・リピートの促進</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="px-4 py-2 font-medium">収益構造改善</td>
                          <td className="px-4 py-2 text-muted-foreground">整備収益の拡大、保険・ローン手数料の獲得、付帯サービスの提案</td>
                        </tr>
                        <tr className="border-b border-border bg-secondary/30">
                          <td className="px-4 py-2 font-medium">専門性強化</td>
                          <td className="px-4 py-2 text-muted-foreground">特定車種への特化、地域No.1の確立、EV整備など新技術への対応</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            {/* おわりに */}
            <section className="mb-16">
              <div className="rounded-lg border-2 border-amber-500 bg-gradient-to-br from-amber-50 to-background p-8">
                <h2 className="mb-4 text-2xl font-bold">おわりに：営業担当者への示唆</h2>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  本テキストで解説した中古車流通の構造と現状を理解することは、Symphony営業担当者にとって以下の意義があります。
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">1</div>
                    <div>
                      <h4 className="font-medium">顧客との対話の質向上</h4>
                      <p className="mt-1 text-sm text-muted-foreground">業界の構造を理解することで、顧客（中古車販売店）の課題や悩みを深く理解できます。「この営業は業界をわかっている」と信頼を得ることが、商談の第一歩となります。</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">2</div>
                    <div>
                      <h4 className="font-medium">課題に基づく提案</h4>
                      <p className="mt-1 text-sm text-muted-foreground">流通の各段階における課題を理解することで、Symphonyの機能が「どの課題を解決するか」を具体的に説明できます。</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">3</div>
                    <div>
                      <h4 className="font-medium">長期的なパートナーシップ</h4>
                      <p className="mt-1 text-sm text-muted-foreground">単なるシステム販売ではなく、販売店の経営課題を共に解決するパートナーとしての姿勢が、長期的な関係構築につながります。</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-lg bg-amber-100 p-4">
                  <p className="text-center text-sm font-medium">
                    中古車流通は、一見すると複雑に見えますが、「仕入れ→在庫→販売」という基本的な流れを理解すれば、全体像が見えてきます。<br />
                    本テキストが、その理解の一助となれば幸いです。
                  </p>
                </div>
              </div>
            </section>

            {/* 付録 */}
            <section className="mb-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">付録：参考データ・統計</h2>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 font-semibold">中古車登録台数の推移</h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-2 py-1 text-left">年度</th>
                        <th className="px-2 py-1 text-right">登録車</th>
                        <th className="px-2 py-1 text-right">軽自動車</th>
                        <th className="px-2 py-1 text-right">合計</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-2 py-1">2021年</td>
                        <td className="px-2 py-1 text-right">356万台</td>
                        <td className="px-2 py-1 text-right">315万台</td>
                        <td className="px-2 py-1 text-right">671万台</td>
                      </tr>
                      <tr className="border-b border-border bg-secondary/30">
                        <td className="px-2 py-1">2022年</td>
                        <td className="px-2 py-1 text-right">362万台</td>
                        <td className="px-2 py-1 text-right">324万台</td>
                        <td className="px-2 py-1 text-right">686万台</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 font-medium">2023年</td>
                        <td className="px-2 py-1 text-right font-medium">369万台</td>
                        <td className="px-2 py-1 text-right font-medium">326万台</td>
                        <td className="px-2 py-1 text-right font-medium">695万台</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 font-semibold">中古車販売店の店舗数推移</h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-2 py-1 text-left">年度</th>
                        <th className="px-2 py-1 text-right">店舗数</th>
                        <th className="px-2 py-1 text-right">前年比</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-2 py-1">2021年</td>
                        <td className="px-2 py-1 text-right">49,123店</td>
                        <td className="px-2 py-1 text-right text-red-500">-1.1%</td>
                      </tr>
                      <tr className="border-b border-border bg-secondary/30">
                        <td className="px-2 py-1">2022年</td>
                        <td className="px-2 py-1 text-right">48,567店</td>
                        <td className="px-2 py-1 text-right text-red-500">-1.1%</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 font-medium">2023年</td>
                        <td className="px-2 py-1 text-right font-medium">48,012店</td>
                        <td className="px-2 py-1 text-right font-medium text-red-500">-1.1%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 font-semibold">オークション取引台数の推移</h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-2 py-1 text-left">年度</th>
                        <th className="px-2 py-1 text-right">取引台数</th>
                        <th className="px-2 py-1 text-right">落札率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-2 py-1">2021年</td>
                        <td className="px-2 py-1 text-right">695万台</td>
                        <td className="px-2 py-1 text-right">69.1%</td>
                      </tr>
                      <tr className="border-b border-border bg-secondary/30">
                        <td className="px-2 py-1">2022年</td>
                        <td className="px-2 py-1 text-right">710万台</td>
                        <td className="px-2 py-1 text-right">66.5%</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 font-medium">2023年</td>
                        <td className="px-2 py-1 text-right font-medium">705万台</td>
                        <td className="px-2 py-1 text-right font-medium">65.2%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <h4 className="mb-3 font-semibold">中古車輸出台数の推移</h4>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-2 py-1 text-left">年度</th>
                        <th className="px-2 py-1 text-right">輸出台数</th>
                        <th className="px-2 py-1 text-left">主要仕向地</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="px-2 py-1">2021年</td>
                        <td className="px-2 py-1 text-right">118万台</td>
                        <td className="px-2 py-1">ロシア、UAE、NZ</td>
                      </tr>
                      <tr className="border-b border-border bg-secondary/30">
                        <td className="px-2 py-1">2022年</td>
                        <td className="px-2 py-1 text-right">138万台</td>
                        <td className="px-2 py-1">ロシア、UAE、ケニア</td>
                      </tr>
                      <tr>
                        <td className="px-2 py-1 font-medium">2023年</td>
                        <td className="px-2 py-1 text-right font-medium">132万台</td>
                        <td className="px-2 py-1 font-medium">UAE、ケニア、タンザニア</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Back to category */}
            <div className="flex justify-center">
              <Link
                href={`/category/${category.id}`}
                className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 font-medium text-white hover:bg-amber-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                {category.name}に戻る
              </Link>
            </div>
          </div>
        </article>
    </>
  )
}
