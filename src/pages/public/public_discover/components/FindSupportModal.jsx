import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Button from '../../../../components/ui/Button'

const Checkbox = ({ label, checked, onChange }) => (
    <label className="inline-flex items-center gap-2 bg-gray-100 rounded-md px-3 py-2 text-base mr-2 mb-2">
        <input type="checkbox" checked={checked} onChange={(e) => onChange && onChange(e.target.checked)} />
        <span>{label}</span>
    </label>
)

const FindSupportModal = ({ open, onClose }) => {
    const scrollRef = useRef(null)
    const touchStartY = useRef(0)
    const [, setMounted] = useState(false)

    useEffect(() => {
        if (open) {
            // prevent body scroll while modal is open
            const prev = document.body.style.overflow
            document.body.style.overflow = 'hidden'
            setMounted(true)
            return () => {
                document.body.style.overflow = prev || ''
            }
        }
        return undefined
    }, [open])

    if (!open) return null

    const handleWheel = (e) => {
        const el = scrollRef.current
        if (!el) return
        const delta = e.deltaY
        const up = delta < 0
        const atTop = el.scrollTop === 0
        const atBottom = el.scrollHeight - el.clientHeight - el.scrollTop <= 0

        // if scrolling up at top, or down at bottom, prevent background scroll
        if ((up && atTop) || (!up && atBottom)) {
            e.preventDefault()
            e.stopPropagation()
        }
        // otherwise allow the scroll inside the element
    }

    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0]?.clientY || 0
    }

    const handleTouchMove = (e) => {
        const el = scrollRef.current
        if (!el) return
        const currentY = e.touches[0]?.clientY || 0
        const delta = touchStartY.current - currentY
        const up = delta < 0
        const atTop = el.scrollTop === 0
        const atBottom = el.scrollHeight - el.clientHeight - el.scrollTop <= 0

        if ((up && atTop) || (!up && atBottom)) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header - sticky */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Fill the form</h3>
                    <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-900 bg-[#D9D9D9] rounded-full p-1"><X className="w-5 h-5" /></button>
                </div>

                {/* Body - scrollable */}
                <div
                    ref={scrollRef}
                    onWheel={handleWheel}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    className="p-4 overflow-y-auto max-h-[60vh] space-y-4"
                >
                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Interested In</div>
                        <div className="flex flex-wrap">
                            <Checkbox label="Football" />
                            <Checkbox label="Squash" />
                            <Checkbox label="Rugby" />
                            <Checkbox label="Netball" />
                            <Checkbox label="Cricket" />
                            <Checkbox label="Padel" />
                            <Checkbox label="Tennis" />
                            <Checkbox label="Other" />
                        </div>
                        <input placeholder="write specific gamename" className="mt-3 w-full bg-gray-100 rounded-md px-3 py-2 text-base border border-gray-200" />
                    </div>

                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Level</div>
                        <select className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-base">
                            <option>New to the sport</option>
                            <option>Some experience</option>
                            <option>Regular player</option>
                            <option>Competitive</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Preferred Days</div>
                        <div className="flex flex-wrap">
                            <Checkbox label="Weekday evenings" />
                            <Checkbox label="Weekday daytime" />
                            <Checkbox label="Saturday" />
                            <Checkbox label="Sunday" />
                            <Checkbox label="Flexible" />
                        </div>
                    </div>

                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Preference</div>
                        <div className="flex flex-wrap">
                            <Checkbox label="Women-only sessions" />
                            <Checkbox label="Mixed sessions" />
                            <Checkbox label="No preference" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Women-only sessions may be led by male or female coaches.</p>
                    </div>

                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Would you help start something?</div>
                        <div className="flex gap-3">
                            <label className="inline-flex items-center gap-2"><input type="radio" name="help" /> Yes</label>
                            <label className="inline-flex items-center gap-2"><input type="radio" name="help" /> Just want to play</label>
                        </div>
                    </div>

                </div>

                {/* Footer - sticky */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
                    <div className="flex items-center justify-end">
                        <Button variant="primary" className="w-full rounded-lg" onClick={onClose}>Add my name to the list</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FindSupportModal
