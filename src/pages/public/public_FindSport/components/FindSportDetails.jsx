import React from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin } from 'lucide-react'
import Container from '../../../../components/layout/Container'

const FindSportDetails = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const item = location.state?.item || {
    id,
    title: 'Woking Warriors FC',
    type: "Women's Football Club",
    location: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
    day: 'Monday, Wednesday',
    time: '7:00 PM â€“ 9:00 PM',
    homeGround: 'Woking Community Football Stadium',
    image: '/images/detaisPage/detailsBanner.png',
    image2: '/images/detaisPage/sideImage1.png',
    image3: '/images/detaisPage/sideImage1.png',
    about:
      'Woking Warriors FC is a women-focused football club committed to developing talent, teamwork, and confidence. We provide a supportive environment for players to grow both on and off the field.',
    contactEmail: 'info@wokingwarriorsfc.com',
    phone: '+1 234 567 890',
    level: 'Beginner to Intermediate',
    ageGroup: '16+ Years',
    experienceRequired: 'Basic football knowledge preferred (not mandatory)',
    trainingFrequency: '2 days per week',
    matchSchedule: 'Weekend matches & friendly games',
    seasonDuration: '6 months',
    headCoach: 'Sarah Williams',
    coachingStyle: 'Fitness-focused, tactical & player-friendly',
    trialRequired: 'Yes',
    trialDate: '15 September 2025',
    trialTime: '6:30 PM',
    trialLocation: 'Woking Community Football Stadium',
    postedBy: 'Woking Warriors FC (Club Owner)',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Interest submitted â€” demo only')
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Container>
        <div className="py-4 md:py-6 lg:py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#323232] hover:text-[#1D1D1D] mb-4 md:mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          {/* Hero Image */}
          <div className="w-full h-64 md:h-96 lg:h-screen rounded-lg overflow-hidden mb-4 md:mb-6">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>

          {/* Two Images Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8">
            <div className="h-48 md:h-72 rounded-md overflow-hidden">
              <img src={item.image2 || item.image} alt="Club" className="w-full h-full object-cover" />
            </div>
            <div></div>
            <div className="h-48 md:h-72 rounded-md overflow-hidden">
              <img src={item.image3 || item.image} alt="Club" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Content - Club / Session Details */}
            <div className="lg:col-span-2 space-y-5">
              {String(item.type).toLowerCase() === 'sessions' ? (
                // Sessions layout
                <>
                  <div>
                    <p className="font-normal text-[#1D1D1D] text-2xl">
                      <span className="font-semibold">Session:</span> {item.title || 'No information available'}
                    </p>
                    <p className="text-base font-normal text-[#1D1D1D] mt-1">
                      <span className="font-semibold">Type:</span> {item.type || 'No information available'}
                    </p>
                    <div className="flex items-start gap-2 text-[#1D1D1D] mt-1">
                      <MapPin className="w-4 h-4 mt-1 shrink-0" />
                      <span className="text-base font-normal">{item.location || 'No information available'}</span>
                    </div>

                    <div className="mt-2">
                      <p className="text-base font-normal text-[#1D1D1D]"><span className="font-semibold">Sessions Day:</span> {item.day || item.sessionDay || 'No information available'}</p>
                      <p className="text-base font-normal text-[#1D1D1D]"><span className="font-semibold">Training Time:</span> {item.time || item.trainingTime || 'No information available'}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <h2 className="text-lg font-bold text-[#1D1D1D] mb-2">Session Overview</h2>
                    <p className="text-base font-normal text-[#1D1D1D] leading-relaxed">{item.sessionOverview || item.about || 'No information available'}</p>
                  </div>

                  <div className="mt-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Skill Level:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.level || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Age Group:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.ageGroup || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Experience Required:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.experienceRequired || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Equipment:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.equipment || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Training Frequency:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.trainingFrequency || 'No information available'}</p>
                    </div>

                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-2 mt-6">Session Format</h3>
                    {Array.isArray(item.sessionFormat) && item.sessionFormat.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1 text-base font-normal text-[#1D1D1D]">
                        {item.sessionFormat.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base font-normal text-[#1D1D1D]">{item.sessionFormatText || 'No information available'}</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Season Duration:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.seasonDuration || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Head Coach:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.headCoach || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Coaching Style:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.coachingStyle || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Trial Location:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.trialLocation || 'No information available'}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Posted By:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.postedBy || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Contact Email:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.contactEmail || 'No information available'}</p>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Phone:</h3>
                      <p className="text-base font-normal text-[#1D1D1D]">{item.phone || 'No information available'}</p>
                    </div>
                  </div>
                </>
              ) : (
                // Clubs / Training layout
                <>
                  <div>
                    <p className="font-normal text-[#1D1D1D] text-2xl">
                      <span className="font-semibold">Club Name:</span> {item.title || 'No information available'}
                    </p>
                    <p className="text-base font-normal text-[#1D1D1D] mt-1">
                      <span className="font-semibold">Club Type:</span> {item.type || 'No information available'}
                    </p>
                    <div className="flex items-start gap-2 text-[#1D1D1D] mt-1">
                      <MapPin className="w-4 h-4 mt-1 shrink-0" />
                      <span className="text-base font-normal">{item.location || 'No information available'}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-base font-normal text-[#1D1D1D]">
                      <span className="font-semibold">Training Days:</span> {item.day || 'No information available'}
                    </p>
                    <p className="text-base font-normal text-[#1D1D1D]">
                      <span className="font-semibold">Training Time:</span> {item.time || 'No information available'}
                    </p>
                    <p className="text-base font-normal text-[#1D1D1D]">
                      <span className="font-semibold">Home Ground:</span> {item.homeGround || 'No information available'}</p>
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#1D1D1D] mb-2">About the Club</h2>
                    <p className="text-base font-normal text-[#1D1D1D] leading-relaxed">{item.about || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-2">We Are Looking For:</h3>
                    <ul className="list-disc pl-5 space-y-1 text-base font-normal text-[#1D1D1D]">
                      <li>Midfielder</li>
                      <li>Defender</li>
                      <li>Goalkeeper</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Skill Level:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.level || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Age Group:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.ageGroup || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Experience Required:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.experienceRequired || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Training Frequency:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.trainingFrequency || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Match Schedule:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.matchSchedule || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Season Duration:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.seasonDuration || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-2">What We Offer</h3>
                    <ul className="list-disc pl-5 space-y-1 text-base font-normal text-[#1D1D1D]">
                      <li>Professional coaching</li>
                      <li>Regular match exposure</li>
                      <li>Safe & women-only environment</li>
                      <li>Skill development sessions</li>
                      <li>Team jerseys & equipment support</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Head Coach:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.headCoach || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Coaching Style:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.coachingStyle || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Trial Required:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.trialRequired || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Trial Date:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.trialDate || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Trial Time:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.trialTime || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Trial Location:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.trialLocation || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Posted By:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.postedBy || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Contact Email:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.contactEmail || 'No information available'}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">Phone:</h3>
                    <p className="text-base font-normal text-[#1D1D1D]">{item.phone || 'No information available'}</p>
                  </div>
                </>
              )}
            </div>

            {/* Right Sidebar - Register Interest Form */}
            <aside className="lg:col-span-1">
              <div className="bg-[#E7F1F1] rounded-lg p-6 lg:sticky lg:top-40 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
                <h2 className="text-xl font-bold text-[#1D1D1D] mb-6">Register Interest</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-base font-medium text-[#1D1D1D] mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="Player"
                      className="w-full px-4 py-3 rounded-md bg-loginInput border-none text-base text-[#1D1D1D] placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-btn-primary"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-base font-medium text-[#1D1D1D] mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="enter your email"
                      className="w-full px-4 py-3 rounded-md bg-loginInput border-none text-base text-[#1D1D1D] placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-btn-primary"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-base font-medium text-[#1D1D1D] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="enter your phone number"
                      className="w-full px-4 py-3 rounded-md bg-loginInput border-none text-base text-[#1D1D1D] placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-btn-primary"
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-base font-medium text-[#1D1D1D] mb-2">Position</label>
                    <input
                      type="text"
                      placeholder="write your position"
                      className="w-full px-4 py-3 rounded-md bg-loginInput border-none text-base text-[#1D1D1D] placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-btn-primary"
                    />
                  </div>

                  {/* Skill Level */}
                  <div>
                    <label className="block text-base font-medium text-[#1D1D1D] mb-2">Skill Level</label>
                    <select className="w-full px-4 py-3 rounded-md bg-loginInput border-none text-base text-[#1D1D1D] focus:outline-none focus:ring-2 focus:ring-btn-primary">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>

                  {/* About Me */}
                  <div>
                    <label className="block text-base font-medium text-[#1D1D1D] mb-2">About Me</label>
                    <textarea
                      placeholder="write about you"
                      rows="4"
                      className="w-full px-4 py-3 rounded-md bg-loginInput border-none text-base text-[#1D1D1D] placeholder-[#5E5E5E] focus:outline-none focus:ring-2 focus:ring-btn-primary resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="bg-btn-primary hover:bg-[#0d655d] text-white font-medium px-6 py-2.5 rounded-md transition-colors"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default FindSportDetails
