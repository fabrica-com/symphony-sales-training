"use client"

import type { Training, Category } from "@/lib/training-data"
import type { SessionContent, DeepDiveReading } from "@/lib/session-data/types"
import { useSessionState } from "@/lib/hooks/useSessionState"
import { SessionHeader } from "./_components/SessionHeader"
import { CheckinPhase } from "./_components/phases/CheckinPhase"
import { ReviewPhase } from "./_components/phases/ReviewPhase"
import { MissionPhase } from "./_components/phases/MissionPhase"
import { StoryPhase } from "./_components/phases/StoryPhase"
import { InfographicPhase } from "./_components/phases/InfographicPhase"
import { QuickCheckPhase } from "./_components/phases/QuickCheckPhase"
import { QuotePhase } from "./_components/phases/QuotePhase"
import { SimulationPhase } from "./_components/phases/SimulationPhase"
import { RoleplayPhase } from "./_components/phases/RoleplayPhase"
import { WorkPhase } from "./_components/phases/WorkPhase"
import { ReflectionPhase } from "./_components/phases/ReflectionPhase"
import { CompletePhase } from "./_components/phases/CompletePhase"
import { PreviewPhase } from "./_components/phases/PreviewPhase"
import { ActionPhase } from "./_components/phases/ActionPhase"
import { DeepDivePhase } from "./_components/phases/DeepDivePhase"
import { EndingPhase } from "./_components/phases/EndingPhase"

interface SessionClientProps {
  training: Training
  category: Category
  sessionContent: SessionContent
  deepDiveContent?: DeepDiveReading | null
  currentIndex?: number
  totalCount?: number
  nextTrainingId?: number
}

export function SessionClient({
  training,
  category,
  sessionContent,
  deepDiveContent: deepDiveContentProp,
  currentIndex = 0,
  totalCount = 0,
  nextTrainingId,
}: SessionClientProps) {
  const deepDiveContent = deepDiveContentProp ?? null

  const s = useSessionState({ training, category, sessionContent, deepDiveContent })

  return (
    <div className="min-h-screen bg-background">
      <SessionHeader
        trainingId={training.id}
        elapsedTime={s.elapsedTime}
        points={s.points}
        progress={s.progress}
        formatTime={s.formatTime}
        currentIndex={currentIndex}
        totalCount={totalCount}
      />

      <main className="mx-auto max-w-2xl px-4 py-6">
        {s.currentPhase === "checkin" && (
          <CheckinPhase
            moodOptions={sessionContent.moodOptions}
            selectedMood={s.selectedMood}
            onMoodSelect={s.handleMoodSelect}
            onNext={s.goToNextPhase}
          />
        )}

        {s.currentPhase === "review" && sessionContent.reviewQuiz && (
          <ReviewPhase
            quiz={sessionContent.reviewQuiz}
            reviewAnswer={s.reviewAnswer}
            showResult={s.showReviewResult}
            onAnswer={s.handleReviewAnswer}
            onNext={s.goToNextPhase}
          />
        )}

        {s.currentPhase === "mission" && (
          <MissionPhase
            trainingId={training.id}
            trainingTitle={training.title}
            sessionContent={sessionContent}
            onNext={s.goToNextPhase}
          />
        )}

        {s.currentPhase === "story1" && sessionContent.story?.part1?.length && (
          <StoryPhase
            part="part1"
            scenes={sessionContent.story.part1}
            sceneIndex={s.storySceneIndex}
            onPrev={() => s.setStorySceneIndex((i) => Math.max(0, i - 1))}
            onNext={() => s.setStorySceneIndex((i) => i + 1)}
            onComplete={s.handleStoryComplete}
          />
        )}

        {s.currentPhase === "infographic" && sessionContent.infographic && (
          <InfographicPhase
            infographic={sessionContent.infographic}
            onNext={s.goToNextPhase}
          />
        )}

        {s.currentPhase === "quickcheck" && sessionContent.quickCheck?.length && (
          <QuickCheckPhase
            questions={sessionContent.quickCheck}
            currentIndex={s.quickCheckIndex}
            answer={s.quickCheckAnswer}
            showResult={s.showQuickCheckResult}
            onAnswer={s.handleQuickCheckAnswer}
            onNext={s.handleNextQuickCheck}
          />
        )}

        {s.currentPhase === "story2" && sessionContent.story?.part2?.length && (
          <StoryPhase
            part="part2"
            scenes={sessionContent.story.part2}
            sceneIndex={s.storySceneIndex}
            onPrev={() => s.setStorySceneIndex((i) => Math.max(0, i - 1))}
            onNext={() => s.setStorySceneIndex((i) => i + 1)}
            onComplete={s.handleStoryComplete}
          />
        )}

        {s.currentPhase === "quote" && sessionContent.quote && (
          <QuotePhase
            quote={sessionContent.quote}
            onNext={s.goToNextPhase}
          />
        )}

        {s.currentPhase === "simulation" && sessionContent.simulation?.length && (
          <SimulationPhase
            scenarios={sessionContent.simulation}
            currentIndex={s.simulationIndex}
            answer={s.simulationAnswer}
            showResult={s.showSimulationResult}
            onAnswer={s.handleSimulationAnswer}
            onNext={s.handleNextSimulation}
          />
        )}

        {s.currentPhase === "roleplay" && sessionContent.roleplay?.length && (
          <RoleplayPhase
            scenarios={sessionContent.roleplay}
            currentIndex={s.roleplayIndex}
            dialogueIndex={s.roleplayDialogueIndex}
            isComplete={s.roleplayComplete}
            onAdvanceDialogue={() => s.setRoleplayDialogueIndex((i) => i + 1)}
            onComplete={s.handleRoleplayComplete}
            onNext={s.handleNextRoleplay}
          />
        )}

        {s.currentPhase === "work" && sessionContent.work && (
          <WorkPhase
            work={sessionContent.work}
            workFields={s.workFields}
            isComplete={s.isWorkComplete}
            onFieldChange={s.handleWorkFieldChange}
            onSubmit={s.handleWorkSubmit}
          />
        )}

        {s.currentPhase === "reflection" && (
          <ReflectionPhase
            question={sessionContent.reflection?.question}
            placeholder={sessionContent.reflection?.placeholder}
            reflectionText={s.reflectionText}
            onTextChange={s.setReflectionText}
            onSubmit={s.handleReflectionSubmit}
          />
        )}

        {s.currentPhase === "complete" && (
          <CompletePhase
            trainingId={training.id}
            trainingTitle={training.title}
            badge={sessionContent.badge}
            points={s.points}
            currentIndex={currentIndex}
            totalCount={totalCount}
            nextTrainingId={nextTrainingId}
            onNext={s.goToNextPhase}
          />
        )}

        {s.currentPhase === "preview" && (
          <PreviewPhase onNext={s.goToNextPhase} />
        )}

        {s.currentPhase === "action" && (
          <ActionPhase
            actionOptions={sessionContent.actionOptions}
            selectedAction={s.selectedAction}
            onSelect={s.handleActionSelect}
            onNext={s.goToNextPhase}
          />
        )}

        {s.currentPhase === "deepdive" && deepDiveContent && (
          <DeepDivePhase
            content={deepDiveContent}
            expandedSections={s.expandedSections}
            deepDiveRead={s.deepDiveRead}
            onToggleSection={s.toggleSection}
            onExpandAll={s.expandAllSections}
            onComplete={s.handleDeepDiveComplete}
          />
        )}

        {s.currentPhase === "ending" && (
          <EndingPhase
            trainingId={training.id}
            keyPhrase={sessionContent.keyPhrase}
            points={s.points}
            elapsedTime={s.elapsedTime}
            formatTime={s.formatTime}
            user={s.user}
            currentIndex={currentIndex}
            totalCount={totalCount}
            nextTrainingId={nextTrainingId}
          />
        )}
      </main>
    </div>
  )
}
