import React, { useState } from 'react'
import Container from '../../../../components/layout/Container'
import Button from '../../../../components/ui/Button'
import FindSupportModal from './FindSupportModal'

const DiscoverEmptyPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <section className="py-6 lg:py-10 bg-[#F8FAFC]">
            <Container>
                <div className="max-w-2xl mx-auto text-center ">
                    <img
                        src="https://i.ibb.co.com/jPC3xh1x/Frame-2147226558-1.png"
                        alt="Search illustration"
                        className="mx-auto w-[600px] h-48 md:h-[500px] object-contain mb-6"
                    />

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Don’t see your sport locally?</h2>

                    <p className="text-gray-600 mb-6">
                        Tell us what you’d love to play — we’ll show clubs there’s demand in your area. Help us bring more sport to your area.
                    </p>

                    <Button variant="primary" className="px-6 py-3 rounded-lg" onClick={() => setIsModalOpen(true)}>
                        What would you like to see?
                    </Button>
                </div>
            </Container>

            <FindSupportModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    )
}

export default DiscoverEmptyPage
