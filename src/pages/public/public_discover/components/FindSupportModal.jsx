import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Swal from 'sweetalert2'
import { POST } from '../../../../services/httpMethods'
import { ENDPOINT } from '../../../../services/httpEndpoint'

const Checkbox = ({ label, checked, onChange }) => (
    <label className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm mr-2 mb-2 cursor-pointer select-none transition-all ${
        checked ? 'bg-[#F5F1EB] text-[#0f756d] border-[#F5F1EB] font-semibold' : 'bg-white/10 text-white border-white/20 hover:border-white/40'
    }`}>
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={(e) => onChange && onChange(e.target.checked)} 
            className="cursor-pointer accent-[#0f756d]" 
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

            <div className="relative w-full max-w-md mx-4 bg-[#0f756d] rounded-2xl shadow-2xl overflow-hidden">
                {/* Header - sticky */}
                <div className="sticky top-0 bg-[#0f756d] border-b border-white/15 px-4 py-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Fill the form</h3>
                    <button onClick={onClose} aria-label="Close" className="text-white hover:bg-white/20 bg-white/10 rounded-full p-1 transition-colors"><X className="w-5 h-5" /></button>
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
                        <div className="text-base font-medium text-white mb-2">Interested In</div>
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
                            className="mt-3 w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-base text-[#1A1D1D] outline-none placeholder:text-gray-500 focus:ring-2 focus:ring-white/40 disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <div className="text-base font-medium text-white mb-2">Level</div>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full rounded-lg border border-transparent bg-[#F5F1EB] px-3 py-2.5 text-base text-[#1A1D1D] outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
                        >
                            <option value="New to the sport">New to the sport</option>
                            <option value="Some experience">Some experience</option>
                            <option value="Regular player">Regular player</option>
                            <option value="Competitive">Competitive</option>
                        </select>
                    </div>

                    <div>
                        <div className="text-base font-medium text-white mb-2">Preferred Days</div>
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
                        <div className="text-base font-medium text-white mb-2">Preference</div>
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
                        <p className="text-xs text-white/70 mt-2">Women-only sessions may be led by male or female coaches.</p>
                    </div>

                    <div>
                        <div className="text-base font-medium text-white mb-2">Would you help start something?</div>
                        <div className="flex gap-4">
                            <label className="inline-flex items-center gap-2 cursor-pointer text-white/90 font-medium hover:text-white transition-colors">
                                <input
                                    type="radio"
                                    name="help"
                                    checked={wantToHelpStart === true}
                                    onChange={() => setWantToHelpStart(true)}
                                    className="cursor-pointer accent-[#F5F1EB]"
                                />
                                Yes
                            </label>
                            <label className="inline-flex items-center gap-2 cursor-pointer text-white/90 font-medium hover:text-white transition-colors">
                                <input
                                    type="radio"
                                    name="help"
                                    checked={wantToHelpStart === false}
                                    onChange={() => setWantToHelpStart(false)}
                                    className="cursor-pointer accent-[#F5F1EB]"
                                />
                                Just want to play
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer - sticky */}
                <div className="sticky bottom-0 bg-[#0f756d] border-t border-white/15 px-4 py-3">
                    <button
                        type="button"
                        className="w-full bg-[#F5F1EB] text-[#0f756d] py-3 rounded-xl font-bold hover:bg-white hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={submitting}
                        onClick={handleSubmit}
                    >
                        {submitting ? 'Submitting...' : 'Add my name to the list'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FindSupportModal
