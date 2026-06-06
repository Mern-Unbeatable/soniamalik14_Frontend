// import React, { useState, useEffect, useRef } from 'react'
// import { useLocation } from 'react-router-dom'
// import Container from '../../../components/layout/Container'
// import PageHeader from '../../../components/ui/PageHeader'
// import Filters from '../public_discover/components/Filters'
// import FindSportCard from './components/FindSportCard'
// import Pagination from '../../../components/ui/Pagination'
// import FindSupportEmptyPage from './components/FindSupportEmptyPage'
// import FindSupportModal from './components/FindSupportModal'


// const FindSport = () => {
//     const [active, setActive] = useState('All')
//     const [postcode, setPostcode] = useState('')
//     const location = useLocation()
//     const listingsRef = useRef(null)

//     // dummy JSON provided 
//     const data = [
//         {
//             category: 'Football',
//             listings: [
//                 {
//                     title: 'Woking Warriors FC',
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'SE16',
//                     image: 'https://i.ibb.co.com/DHnsZm9z/0e81fed56f063316e5ed5a4fcd82ac8d7c12afc3.jpg',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Football',
//                 },

//                 {
//                     title: 'South London Valkyries RFC',
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'SE17',
//                     image: 'https://i.ibb.co.com/rGvNtr4d/df71bf67a838e00fd11edb118e53a81b80a20aaa.png',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Football',
//                 },

//                 {
//                     title: "Women's Squash Collective",
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'SE18',
//                     image: 'https://i.ibb.co.com/G3HZW39N/b21ac30807fd96a1f3581d1aeb6b3f1da65ce019.jpg',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Football',
//                 },
//             ],
//         },

//         {
//             category: 'Padel',
//             listings: [
//                 {
//                     title: 'Beginner Basics Boot Camp',
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'SW18',
//                     image: 'https://i.ibb.co.com/yFZ08JvN/2060c52766b6f94c11ca3a3be3143345424e0ae9.jpg',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Padel',
//                 },

//                 {
//                     title: "Surrey Women's Cricket Club",
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'SW19',
//                     image: 'https://i.ibb.co.com/xS21tyFx/1645197dc12dbdc10da95068961a9a4778829ef6.jpg',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Padel',
//                 },

//                 {
//                     title: "Women's Tennis Fundamentals",
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'SW20',
//                     image: 'https://i.ibb.co.com/9HdBVXRF/a0d457b7a72ad48b4489eaef2cb73dc79be9e0bd.jpg',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Padel',
//                 },
//             ],
//         },

//         {
//             category: 'Squash',
//             listings: [
//                 {
//                     title: 'Social Netball Evening',
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'N1',
//                     image: 'https://i.ibb.co.com/kYR452H/75ab23cce7034147dd56125b4c2898b6ed54ddce.png',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Squash',
//                 },

//                 {
//                     title: 'Cricket Skill Development',
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'N2',
//                     image: 'https://i.ibb.co.com/5xFWbM4r/7e2b08c8b335409f7fc87843634410f1547628e9.jpg',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Squash',
//                 },

//                 {
//                     title: 'Weekly 5-a-Side Session',
//                     location: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
//                     postcode: 'N3',
//                     image: 'https://i.ibb.co.com/5xFWbM4r/7e2b08c8b335409f7fc87843634410f1547628e9.jpg',
//                     days: ['Monday', 'Wednesday'],
//                     time: '19:00 - 21:00',
//                     tag: 'Squash',
//                 },
//             ],
//         },
//     ]

//     const listings = data.flatMap((cat, idx) =>
//         cat.listings.map((l, i) => ({
//             id: `${idx}-${i}`,
//             title: l.title,
//             location: l.location,
//             postcode: l.postcode,
//             day: (l.days || []).join(', '),
//             time: l.time,
//             type: l.tag || cat.category,
//             image: l.image,
//         }))
//     )

//     const filtered = listings.filter((s) => {
//         const sportMatch = active === 'All' || s.type.toLowerCase() === active.toLowerCase()
//         const pc = (postcode || '').trim()
//         const postcodeMatch = !pc || (s.postcode && s.postcode.toLowerCase().includes(pc.toLowerCase())) || (s.location && s.location.toLowerCase().includes(pc.toLowerCase()))
//         return sportMatch && postcodeMatch
//     })

//     // pagination
//     const [page, setPage] = React.useState(1)
//     const pageSize = 9
//     const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
//     const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

//     const [modalOpen, setModalOpen] = React.useState(false)

//     // if navigated with ?sport=padel (from home tiles), set active filter and scroll
//     useEffect(() => {
//         const params = new URLSearchParams(location.search)
//         const sport = params.get('sport')
//         if (sport) {
//             const label = sport.charAt(0).toUpperCase() + sport.slice(1)
//             setActive(label)
//             setPage(1)
//             // ensure page shows from top when arriving from homepage tiles
//             setTimeout(() => {
//                 try {
//                     window.scrollTo({ top: 0, behavior: 'smooth' })
//                 } catch (e) {
//                     // fallback
//                     window.scrollTo(0, 0)
//                 }
//             }, 100)
//         }
//     }, [location.search])

//     return (
//         <section className="py-8">
//             <Container>
//                 <PageHeader title="Find Sport" />

//                 <div className="mt-6">
//                     <Filters
//                         active={active}
//                         onFilter={(t) => { setActive(t); setPage(1) }}
//                         postcode={postcode}
//                         onPostcodeChange={(v) => { setPostcode(v); setPage(1) }}
//                         types={["All", "Football", "Padel", "Squash"]}
//                     />
//                 </div>

//                 <div className="mt-6">
//                     {filtered.length > 0 ? (
//                         <>
//                             <div ref={listingsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {paginated.map((item) => (
//                                     <FindSportCard key={item.id} item={item} />
//                                 ))}
//                             </div>

//                             <Pagination page={page} total={totalPages} onChange={(p) => setPage(p)} />
//                         </>
//                     ) : (
//                         <FindSupportEmptyPage onOpen={() => setModalOpen(true)} />
//                     )}
//                 </div>

//                 <FindSupportModal open={modalOpen} onClose={() => setModalOpen(false)} />

//             </Container>
//         </section>
//     )
// }

// export default FindSport
