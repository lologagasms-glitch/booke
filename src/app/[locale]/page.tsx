"use client"
import { SearchBar } from "@/components/SearchBar";
import ModernCarousel from "./Carousel";
import { Suspense } from "react";
import Loading from "./loading";
import { usePopularEtablissements } from "@/components/hooks/etablissements";
import CompanyStats from "@/components/companyState";
import PopularEtablissements from "@/components/establishments/populaEtablissement";
import TestimonialSlider from "@/components/establishments/testimonialSlider";
import PartnersSlider from "@/components/establishments/partenerSlide";
const testimonials = [
    {
      id: 1,
      nameKey: "Marie L.",
      locationKey: "Paris, France",
      rating: 5,
      commentKey: "Séjour inoubliable ! L'hôtel était parfait et le service impeccable. Je recommande vivement !",
      establishmentKey: "Hôtel Le Parisien",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 2,
      nameKey: "Jean D.",
      locationKey: "Lyon, France",
      rating: 5,
      commentKey: "Le parc d'attractions est fantastique pour toute la famille. Mes enfants ont adoré !",
      establishmentKey: "Parc Aventure",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 3,
      nameKey: "Sophie M.",
      locationKey: "Marseille, France",
      rating: 4,
      commentKey: "Très bel établissement avec une vue magnifique sur la mer. Le personnel était très accueillant.",
      establishmentKey: "Resort Côté Mer",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 4,
      nameKey: "Pierre T.",
      locationKey: "Nice, France",
      rating: 5,
      commentKey: "Expérience unique ! Le spa est incroyable et le personnel très attentionné.",
      establishmentKey: "Spa & Détente",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 5,
      nameKey: "Emma R.",
      locationKey: "Bordeaux, France",
      rating: 5,
      commentKey: "Parfait pour notre escapade romantique. Le cadre était magique et les équipements top.",
      establishmentKey: "Gîte Bordelais",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 6,
      nameKey: "Lucas B.",
      locationKey: "Lille, France",
      rating: 4,
      commentKey: "Excellent rapport qualité-prix. Le parc aquatique a été un succès auprès des enfants.",
      establishmentKey: "Aqua Parc",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 7,
      nameKey: "Clara V.",
      locationKey: "Strasbourg, France",
      rating: 5,
      commentKey: "Maison d'hôtes charmante avec un petit-déjeuner délicieux. Hôtes très sympathiques.",
      establishmentKey: "Maison Alsacienne",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 8,
      nameKey: "Marc A.",
      locationKey: "Toulouse, France",
      rating: 5,
      commentKey: "Le parc zoologique est magnifique. Les animaux semblent heureux et bien entretenus.",
      establishmentKey: "Zoo du Sud-Ouest",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/846741/pexels-photo-846741.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 9,
      nameKey: "Julie C.",
      locationKey: "Nantes, France",
      rating: 4,
      commentKey: "Bonne expérience globale. La chambre était propre et confortable. Je reviendrai.",
      establishmentKey: "Hôtel du Centre",
      type: "hotel",
      avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&h=100&w=100"
    },
    {
      id: 10,
      nameKey: "Thomas G.",
      locationKey: "Montpellier, France",
      rating: 5,
      commentKey: "Le parc de loisirs offre des attractions pour tous les âges. Journée mémorable !",
      establishmentKey: "Fun Park",
      type: "leisure",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&h=100&w=100"
    }
  ];
   const partners = [
    {
      name: "Accor",
      logo: "https://logonews.fr/wp-content/uploads/2019/03/accor-fond.jpg",
      website: "https://all.accor.com/a/fr.html",
      description: "Accor est un groupe hôtelier mondial offrant des marques diversifiées de l'économique au luxe."
    },
    {
      name: "Royal Garden",
      logo: "https://royalgarden.com.tn/wp-content/uploads/2021/11/258882747_300440018666716_688477937116930594_n.png",
      website: "https://royalgarden.com.tn/",
      description: "Le Royal Garden Hotel est un hôtel de luxe cinq étoiles situé à Kensington, Londres, offrant un service haut de gamme."
    },
    {
      name: "hotel hilton toronto",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYqcU6HmyRDTSTYBOzJN3G9MTl0E1TjkWsHA&s",
      website: "https://www.hilton.com/en/?WT.mc_id=zINDA0EMEA1MB2PSH3Paid_ggl4ACBI_Corebrand5dkt6MULTIBR7ML8i81487387_121127646_123373953&&&&&gclsrc=aw.ds&gad_source=1&gad_campaignid=123373953&gclid=Cj0KCQiAi9rJBhCYARIsALyPDtvFs7aOaumf9a7IJX5R8Gp7OLIoG7BEMudfM8jx72RoRdtLdJ9EckUaAtRREALw_wcB",
      description: "Le Hilton Toronto est un hôtel urbain haut de gamme offrant un accès central aux attractions et services d'affaires."
    },
    {
      name: "Radisson Hotel Group",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwuVpt40QuPW0Jin-jJz2or52eWj8ceu1iJg&s",
      website: "https://www.radissonhotels.com/fr-fr/marque/radisson?facilitatorId=RHGSEM&cid=a%3Aps+b%3Aggl+c%3Aemea+i%3Abrand+e%3Arad+r%3Atlb+f%3Afr-FR+g%3Acl+h%3AMultiple+v%3Acf&gclsrc=aw.ds&gad_source=1&gad_campaignid=299159336&gclid=Cj0KCQiAi9rJBhCYARIsALyPDtt3mF711-F1eVzONuoUHScSpAkS-9QPzntRF_anY0M1qs2tnQCR1MkaAlgTEALw_wcB",
      description: "Radisson Blu, Red - 1 500+ propriétés"
    },
  ];
export default function Main(){
  const { data:popularEtab, isLoading, isError, refetch } = usePopularEtablissements({ limit: 12 });
  return( <>
    <div className="bg-gray-800">
        <Suspense fallback={<Loading />}>
          <ModernCarousel />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <SearchBar/>
        </Suspense>
       
        <Suspense fallback={<Loading />}>
          <CompanyStats />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <PopularEtablissements data={popularEtab} isError={isError} isLoading={isLoading} refetch={refetch} />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <TestimonialSlider testimonials={testimonials} autoplay={true}  />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <PartnersSlider partners={partners} autoplay={true} />
        </Suspense>
      
    </div>
  </>)
}