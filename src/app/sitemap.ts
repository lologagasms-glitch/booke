import { MetadataRoute } from 'next';
import { getAllEtablissementsOnlyNameAndId } from '@/app/lib/services/etablissement.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bookeing.com';

    const etablissements = await getAllEtablissementsOnlyNameAndId();

    const etablissementUrls = etablissements.map((etab) => ({
        url: `${baseUrl}/etablissements/${etab.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/teams`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...etablissementUrls,
    ];
}
