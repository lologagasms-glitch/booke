"use client"
import { TransletText } from "@/app/lib/services/translation/transletText"

 export const Field = ({
    label,
    children,
  }: {
    label?: string
    children: React.ReactNode
  }) => {
    return (
        <div>
      <div className="mb-2 text-sm font-medium text-gray-700"><TransletText>{label||""}</TransletText></div>
     {children}
    </div>
  )}
