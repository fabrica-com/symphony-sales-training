"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MigratePage() {
  const [log, setLog] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const addLog = (msg: string) => {
    setLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
  }

  const migrateCategories = async () => {
    addLog("Migrating categories...")
    const res = await fetch("/api/migrate-training-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "categories" })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    addLog("Categories migrated!")
  }

  const migrateTrainings = async () => {
    addLog("Migrating trainings...")
    const res = await fetch("/api/migrate-training-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "trainings", startId: 1, endId: 130 })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    addLog(`Trainings migrated: ${data.migrated} items`)
  }

  const migrateDeepDive = async () => {
    addLog("Migrating deep dive content...")
    const res = await fetch("/api/migrate-deep-dive", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startId: 1, endId: 10 })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    addLog(`Deep dive migrated: ${data.migrated} items`)
  }

  const migrateTestData = async () => {
    addLog("Migrating test data...")
    const res = await fetch("/api/migrate-test-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    addLog(`Test data migrated: ${JSON.stringify(data.results)}`)
  }

  const runFullMigration = async () => {
    setIsRunning(true)
    setLog([])
    try {
      await migrateCategories()
      await migrateTrainings()
      await migrateDeepDive()
      await migrateTestData()
      addLog("All migrations complete!")
    } catch (error) {
      addLog(`Error: ${error}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Training Data Migration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={runFullMigration} disabled={isRunning}>
              {isRunning ? "Running..." : "Run Full Migration"}
            </Button>
            <Button onClick={async () => {
              setIsRunning(true)
              setLog([])
              try {
                await migrateTestData()
                addLog("Test data migration complete!")
              } catch (error) {
                addLog(`Error: ${error}`)
              } finally {
                setIsRunning(false)
              }
            }} disabled={isRunning} variant="outline">
              Migrate Test Data Only
            </Button>
          </div>
          
          <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {log.length === 0 ? "Logs will appear here..." : log.join("\n")}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
