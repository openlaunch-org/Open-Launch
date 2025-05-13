/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

import { CopyButton } from "./copy-button"
import { ShowCode } from "./show-code"

interface BadgesDisplayProps {
  dailyRanking: number
  slug: string
}

export function BadgesDisplay({ dailyRanking, slug }: BadgesDisplayProps) {
  const lightBadgeCode = `<a href=\"https://productlaunch.com.br/projects/${slug}\" target=\"_blank\" title=\"Open-Launch Top ${dailyRanking} Daily Winner\">
  <img 
    src=\"https://productlaunch.com.br/images/badges/top${dailyRanking}-light.svg\" 
    alt=\"Product Launch Top ${dailyRanking} Produto do Dia\" 
    style=\"width: 195px; height: auto;\" 
  />
</a>`

  const darkBadgeCode = `<a href=\"https://productlaunch.com.br/projects/${slug}\" target=\"_blank\" title=\"Open-Launch Top ${dailyRanking} Daily Winner\">
  <img 
    src=\"https://productlaunch.com.br/images/badges/top${dailyRanking}-dark.svg\" 
    alt=\"Product Launch Top ${dailyRanking} Produto do Dia\" 
    style=\"width: 195px; height: auto;\" 
  />
</a>`

  const [showLightCode, setShowLightCode] = useState(false)
  const [showDarkCode, setShowDarkCode] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2">
      {/* Light Theme */}
      <div className="flex flex-col items-center gap-4">
        <div className="mb-2 flex w-full flex-row items-center justify-between gap-2 sm:gap-4">
          <h2 className="text-base font-semibold sm:text-lg">Light Theme</h2>
          <div className="flex flex-row items-center gap-2">
            <ShowCode show={showLightCode} onClick={() => setShowLightCode((v) => !v)} />
            <CopyButton code={lightBadgeCode} />
          </div>
        </div>
        <div className="flex w-full justify-center">
          <img
            src={`/images/badges/top${dailyRanking}-light.svg`}
            alt={`Product Launch Top ${dailyRanking} Produto do Dia`}
            className="h-auto w-[195px]"
          />
        </div>
        {showLightCode && (
          <div className="animate-fade-in relative mt-2 w-full">
            <SyntaxHighlighter language="html" style={vscDarkPlus} wrapLines wrapLongLines>
              {lightBadgeCode}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Dark Theme */}
      <div className="flex flex-col items-center gap-4">
        <div className="mb-2 flex w-full flex-row items-center justify-between gap-2 sm:gap-4">
          <h2 className="text-base font-semibold sm:text-lg">Dark Theme</h2>
          <div className="flex flex-row items-center gap-2">
            <ShowCode show={showDarkCode} onClick={() => setShowDarkCode((v) => !v)} />
            <CopyButton code={darkBadgeCode} />
          </div>
        </div>
        <div className="flex w-full justify-center">
          <img
            src={`/images/badges/top${dailyRanking}-dark.svg`}
            alt={`Product Launch Top ${dailyRanking} Produto do Dia`}
            className="h-auto w-[195px]"
          />
        </div>
        {showDarkCode && (
          <div className="animate-fade-in relative mt-2 w-full">
            <SyntaxHighlighter language="html" style={vscDarkPlus} wrapLines wrapLongLines>
              {darkBadgeCode}
            </SyntaxHighlighter>
          </div>
        )}
      </div>
    </div>
  )
}
