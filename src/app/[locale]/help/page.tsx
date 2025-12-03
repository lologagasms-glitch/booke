"use client"
import { TransletText } from '@/app/lib/services/translation/transletText';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HelpPage() {
    const {locale}=useParams();
    const videos = [
        {
            id: 'dQw4w9WgXcQ', // Placeholder: Rick Roll (classic placeholder, maybe change to something safer or generic nature)
            title: 'Comment réserver votre séjour',
            description: 'Un guide étape par étape pour effectuer votre première réservation en toute simplicité.'
        },
        {
            id: 'jNQXAC9IVRw', // Placeholder: Me at the zoo (first YT video)
            title: 'Gérer votre compte',
            description: 'Apprenez à modifier vos informations personnelles et à consulter vos historiques.'
        },
        {
            id: '9bZkp7q19f0', // Placeholder: Gangnam Style
            title: 'Découvrir nos établissements',
            description: 'Une visite virtuelle de nos plus beaux lieux pour vous aider à choisir.'
        },
        {
            id: 'C0DPdy98e4c', // Placeholder
            title: 'Politique d\'annulation',
            description: 'Tout ce que vous devez savoir sur nos conditions flexibles.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                        <TransletText>Centre d'Aide</TransletText>
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
                        <TransletText>Nous sommes là pour vous accompagner. Découvrez nos tutoriels vidéo pour profiter pleinement de votre expérience Evasion.</TransletText>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-x-8">
                    {videos.map((video) => (
                        <div key={video.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                            <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                <iframe
                                    src={`https://www.youtube.com/embed/${video.id}`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                    style={{ minHeight: '300px' }}
                                ></iframe>
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    <TransletText>{video.title}</TransletText>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    <TransletText>{video.description}</TransletText>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-indigo-700 rounded-3xl overflow-hidden shadow-2xl lg:grid lg:grid-cols-2 lg:gap-4">
                    <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
                        <div className="lg:self-center">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                                <span className="block"><TransletText>Besoin d'aide supplémentaire ?</TransletText></span>
                            </h2>
                            <p className="mt-4 text-lg leading-6 text-indigo-200">
                                <TransletText>Notre équipe de support est disponible 24/7 pour répondre à toutes vos questions. N'hésitez pas à nous contacter si vous ne trouvez pas la réponse que vous cherchez.</TransletText>
                            </p>
                            <Link
                                href={`/${locale}/contact`}
                                className="mt-8 bg-white border border-transparent rounded-md shadow px-5 py-3 inline-flex items-center text-base font-medium text-indigo-600 hover:bg-indigo-50"
                            >
                                <TransletText>Contactez-nous</TransletText>
                            </Link>
                        </div>
                    </div>
                    <div className="relative -mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
                        <img
                            className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
                            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1600&q=80"
                            alt="Support team"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
