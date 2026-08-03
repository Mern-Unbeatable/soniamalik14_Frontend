import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../../../../components/ui/Button'
import { POST } from '../../../../services/httpMethods'
import { ENDPOINT } from '../../../../services/httpEndpoint'

const Checkbox = ({ label, checked, onChange }) => (
    <label className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-base mr-2 mb-2 cursor-pointer select-none transition-all ${
        checked ? 'bg-[#107C66] text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}>
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={(e) => onChange && onChange(e.target.checked)} 
            className="cursor-pointer accent-[#107C66]" 
        />
        <span>{label}</span>
    </label>
)

const LEVEL_MAPPING = {
    'New to the sport': 'NEW_TO_SPORT',
    'Some experience': 'SOME_EXPERIENCE',
    'Regular player': 'REGULAR_PLAYER',
    'Competitive': 'COMPETITIVE'
}

const FindSupportModal = ({ open, onClose }) => {
    const scrollRef = useRef(null)
    const touchStartY = useRef(0)
    const [, setMounted] = useState(false)

    // Form states
    const [sportName, setSportName] = useState('')
    const [otherSportName, setOtherSportName] = useState('')
    const [level, setLevel] = useState('New to the sport')
    const [preferredDays, setPreferredDays] = useState([])
    const [preference, setPreference] = useState('NO_PREFERENCE')
    const [wantToHelpStart, setWantToHelpStart] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        if (open) {
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

        if ((up && atTop) || (!up && atBottom)) {
            e.preventDefault()
            e.stopPropagation()
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!sportName) {
            Swal.fire({
                icon: 'warning',
                title: 'Required Field',
                text: 'Please select a sport.',
                confirmButtonColor: '#107C66'
            })
            return
        }

        if (sportName === 'Other' && !otherSportName.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Required Field',
                text: 'Please specify the sport name.',
                confirmButtonColor: '#107C66'
            })
            return
        }

        const payload = {
            sportName: sportName,
            otherSportName: sportName === 'Other' ? otherSportName.trim() : null,
            level: LEVEL_MAPPING[level] || 'NEW_TO_SPORT',
            preferredDays: preferredDays,
            preference: preference,
            wantToHelpStart: wantToHelpStart
        }

        setSubmitting(true)
        try {
            const response = await POST(ENDPOINT.INTEREST_REQUESTS.CREATE, payload)

            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response?.data?.message || 'Interest request submitted successfully!',
                confirmButtonText: 'Okay',
                confirmButtonColor: '#107C66',
            })

            // Reset form states
            setSportName('')
            setOtherSportName('')
            setLevel('New to the sport')
            setPreferredDays([])
            setPreference('NO_PREFERENCE')
            setWantToHelpStart(false)

            onClose()
        } catch (error) {
            console.error('Error submitting interest request:', error)
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: error?.response?.data?.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#107C66'
            })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header - sticky */}
                <div className="sticky top-0 form-shell border-b border-[#DCE7E6] px-4 py-3 flex items-center justify-between">
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
                            {['Football', 'Squash', 'Rugby', 'Netball', 'Cricket', 'Padel', 'Tennis', 'Other'].map(sport => (
                                <Checkbox
                                    key={sport}
                                    label={sport}
                                    checked={sportName === sport}
                                    onChange={() => setSportName(sport)}
                                />
                            ))}
                        </div>
                        <input
                            placeholder="write specific gamename"
                            value={otherSportName}
                            onChange={(e) => setOtherSportName(e.target.value)}
                            disabled={sportName !== 'Other'}
                            className="mt-3 w-full bg-gray-100 rounded-md px-3 py-2 text-base border border-gray-200 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-[#107C66] focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Level</div>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-[#107C66] focus:border-transparent transition-all"
                        >
                            <option value="New to the sport">New to the sport</option>
                            <option value="Some experience">Some experience</option>
                            <option value="Regular player">Regular player</option>
                            <option value="Competitive">Competitive</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Preferred Days</div>
                        <div className="flex flex-wrap">
                            {[
                                { label: 'Weekday evenings', key: 'WEEKDAY_EVENINGS' },
                                { label: 'Weekday daytime', key: 'WEEKDAY_DAYTIME' },
                                { label: 'Saturday', key: 'SATURDAY' },
                                { label: 'Sunday', key: 'SUNDAY' },
                                { label: 'Flexible', key: 'FLEXIBLE' }
                            ].map(day => (
                                <Checkbox
                                    key={day.key}
                                    label={day.label}
                                    checked={preferredDays.includes(day.key)}
                                    onChange={() => {
                                        setPreferredDays(prev =>
                                            prev.includes(day.key) ? prev.filter(d => d !== day.key) : [...prev, day.key]
                                        )
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Preference</div>
                        <div className="flex flex-wrap">
                            {[
                                { label: 'Women-only sessions', key: 'WOMEN_ONLY' },
                                { label: 'Mixed sessions', key: 'MIXED' },
                                { label: 'No preference', key: 'NO_PREFERENCE' }
                            ].map(pref => (
                                <Checkbox
                                    key={pref.key}
                                    label={pref.label}
                                    checked={preference === pref.key}
                                    onChange={() => setPreference(pref.key)}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Women-only sessions may be led by male or female coaches.</p>
                    </div>

                    <div>
                        <div className="text-base font-medium text-gray-700 mb-2">Would you help start something?</div>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center gap-2 cursor-pointer text-gray-700 font-medium hover:text-[#107C66] transition-colors">
                                <input
                                    type="radio"
                                    name="help"
                                    checked={wantToHelpStart === true}
                                    onChange={() => setWantToHelpStart(true)}
                                    className="cursor-pointer accent-[#107C66]"
                                />
                                Yes
                            </label>
                            <label className="inline-flex items-center gap-2 cursor-pointer text-gray-700 font-medium hover:text-[#107C66] transition-colors">
                                <input
                                    type="radio"
                                    name="help"
                                    checked={wantToHelpStart === false}
                                    onChange={() => setWantToHelpStart(false)}
                                    className="cursor-pointer accent-[#107C66]"
                                />
                                Just want to play
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer - sticky */}
                <div className="sticky bottom-0 form-shell border-t border-[#DCE7E6] px-4 py-3">
                    <div className="flex items-center justify-end">
                        <Button
                            variant="primary"
                            className="w-full rounded-lg font-semibold"
                            disabled={submitting}
                            onClick={handleSubmit}
                        >
                            {submitting ? 'Submitting...' : 'Add my name to the list'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FindSupportModal
