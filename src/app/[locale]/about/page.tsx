'use client';

import Image from "next/image";
import { TransletText } from "../../lib/services/translation/transletText";

export default function AboutPage() {

    // Example history data - could be moved to a separate file or CMS later
    const historyEvents = [
        {
            year: "2010",
            titleKey: "Les débuts",
            descriptionKey: "Notre voyage a commencé avec une idée simple : rendre les voyages accessibles à tous.",
            image: "https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
            year: "2015",
            titleKey: "L'expansion européenne",
            descriptionKey: "Nous avons ouvert nos premiers bureaux à Paris, Rome et Berlin.",
            image: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
            year: "2020",
            titleKey: "L'innovation numérique",
            descriptionKey: "Lancement de notre nouvelle plateforme intelligente pour des réservations instantanées.",
            image: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        },
        {
            year: "2024",
            titleKey: "Aujourd'hui",
            descriptionKey: "Leader du marché avec des milliers de partenaires et des millions de voyageurs heureux.",
            image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gray-50 dark:bg-gray-900">

            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="About Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" /> {/* Overlay */}
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
                        <TransletText>À Propos de Nous</TransletText>
                    </h1>
                    <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-2xl mx-auto animate-fade-in-up delay-100">
                        <TransletText>Découvrez notre histoire, notre passion et notre vision pour le futur du voyage.</TransletText>
                    </p>
                </div>
            </div>

            {/* Intro Section */}
            <section className="py-16 sm:py-24 px-4 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                            <span className="text-yellow-500"><TransletText>Notre Mission</TransletText></span>
                        </h2>
                        <div className="w-20 h-1 bg-yellow-500 rounded-full" />
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            <TransletText>
                                Nous croyons que le voyage est plus qu'un simple déplacement. C'est une opportunité de découvrir, de grandir et de se connecter. Notre mission est de simplifier l'expérience de voyage tout en offrant des séjours inoubliables.
                            </TransletText>
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                            <TransletText>
                                Avec une attention particulière aux détails et un dévouement total envers nos clients, nous transformons chaque réservation en une promesse de souvenirs exceptionnels.
                            </TransletText>
                        </p>
                    </div>
                    <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                        <Image
                            src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Our Team"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* History Section - Dynamic Timeline */}
            <section className="py-16 sm:py-24 px-4 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
                {/* Background Decorative Element */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            <TransletText>Notre Histoire</TransletText>
                        </h2>
                        <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full" />
                    </div>

                    <div className="space-y-12 sm:space-y-24">
                        {historyEvents.map((event, index) => (
                            <div
                                key={event.year}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 group`}
                            >
                                {/* Image Side */}
                                <div className="w-full md:w-1/2 relative">
                                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-gray-800 transition-transform duration-500 group-hover:scale-105 group-hover:shadow-2xl z-10">
                                        <Image
                                            src={event.image}
                                            alt={event.titleKey}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-4 left-4 bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg shadow-md z-20">
                                            {event.year}
                                        </div>
                                    </div>
                                    {/* Decorative backdrop for image */}
                                    <div className={`absolute -bottom-4 -right-4 w-full h-full rounded-2xl border-2 border-yellow-400/30 -z-0 hidden md:block transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2 ${index % 2 !== 0 ? 'left-4 right-auto' : ''}`} />
                                </div>

                                {/* Content Side */}
                                <div className="w-full md:w-1/2 text-center md:text-left">
                                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        <TransletText>{event.titleKey}</TransletText>
                                    </h3>
                                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                        <TransletText>{event.descriptionKey}</TransletText>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-blue-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                        alt="Footer background"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">
                        <TransletText>Prêt à commencer votre aventure ?</TransletText>
                    </h2>
                    <a href="/" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                        <TransletText>Réservez Maintenant</TransletText>
                    </a>
                </div>
            </section>

        </div>
    );
}
