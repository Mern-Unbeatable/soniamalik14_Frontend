import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../../../../components/layout/Container'
import Button from '../../../../components/ui/Button'
import FindSupportModal from './FindSupportModal'
import LoginModal from './LoginModal'
import { useAuth } from '../../../../context/AuthContext'

const DiscoverEmptyPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleButtonClick = () => {
        if (!isAuthenticated) {
            setShowLoginModal(true)
        } else {
            setIsModalOpen(true)
        }
    }

    const handleLoginClick = () => {
        setShowLoginModal(false)
        navigate('/signin')
    }

    return (
        <section className="py-6   bg-[#F8FAFC]">
            <Container>
                <div className="max-w-2xl mx-auto text-center">
                    <img
                        src="https://i.ibb.co.com/jPC3xh1x/Frame-2147226558-1.png"
                        alt="Search illustration"
                        className="mx-auto w-[600px] h-48 md:h-[400px] object-contain "
                    />

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Don’t see your sport locally?</h2>

                    <p className="text-gray-600 mb-6">
                        Tell us what you’d love to play — we’ll show clubs there’s demand in your area. Help us bring more sport to your area.
                    </p>

                    <Button variant="primary" className="px-6 py-3 rounded-lg" onClick={handleButtonClick}>
                        What would you like to see?
                    </Button>
                </div>
            </Container>

            <FindSupportModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLoginClick={handleLoginClick}
            />
        </section>
    )
}

export default DiscoverEmptyPage
