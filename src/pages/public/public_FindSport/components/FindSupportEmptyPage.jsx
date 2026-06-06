import React from 'react'
import Container from '../../../../components/layout/Container'
import Button from '../../../../components/ui/Button'

const FindSupportEmptyPage = ({ onOpen = () => { } }) => {
    return (
        <section className="bg-gray-50 py-12">
            <Container>
                <div className="max-w-2xl mx-auto text-center ">
                    <img
                        src="https://i.ibb.co.com/jPC3xh1x/Frame-2147226558-1.png"
                        alt="Search illustration"
                        className="mx-auto w-[600px] h-48 md:h-[500px] object-contain mb-6"
                    />

                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Donâ€™t see your sport locally?</h2>

                    <p className="text-gray-600 mb-6">
                        Tell us what you'd love to play â€” we'll show clubs there's demand in your area. Help us bring
                        more sport to your area.
                    </p>

                    <Button variant="primary" className="px-6 py-3 rounded-lg" onClick={onOpen}>
                        Enter Your Interested Sport
                    </Button>
                </div>
            </Container>
        </section>
    )
}

export default FindSupportEmptyPage
