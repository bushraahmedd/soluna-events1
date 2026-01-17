import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "./button"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title: string
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    )
}
