"use client"

import { useState } from "react"
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"

export function MedicalDisclaimer() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-amber-800">
            Medical Disclaimer
          </h4>
          <p className="mt-1 text-sm text-amber-700">
            The content on BloomYourGut is for educational and informational
            purposes only. It is not intended as medical advice, diagnosis, or
            treatment.
          </p>
          {expanded && (
            <div className="mt-2 space-y-2 text-sm text-amber-700">
              <p>
                Always consult with a qualified healthcare professional before
                making any changes to your diet, supplements, or health regimen.
                Do not disregard professional medical advice or delay seeking it
                because of something you have read on this website.
              </p>
              <p>
                The information provided is based on peer-reviewed research and
                general health guidelines. Individual results may vary, and what
                works for one person may not work for another.
              </p>
              <p>
                If you are experiencing a medical emergency, call your local
                emergency services immediately.
              </p>
            </div>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-800"
          >
            {expanded ? (
              <>
                Show less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Read full disclaimer <ChevronDown className="h-3 w-3" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
