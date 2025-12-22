"use server"
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { eq } from 'drizzle-orm';
import { mediaChambres, mediaEtablissements } from '@/db/schema';
import { db } from '@/db';

// Configuration
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// 🔧 Fonction de nettoyage des noms de fichiers
function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-') // Remplace caractères spéciaux par des tirets
    .replace(/-+/g, '-') // Remplace plusieurs tirets consécutifs par un seul
    .replace(/^-|-$/g, '') // Supprime les tirets au début et à la fin
    .substring(0, 50); // Limite à 50 caractères
}

async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// 🔧 Fonction améliorée de génération de nom unique
function generateUniqueFilename(nom: string, originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  
  // Extrait l'extension et le nom de base
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  const originalBaseName = originalName.split('.')[0];
  
  // Utilise le nom fourni ou le nom original comme base
  let baseName = nom && nom.trim() !== '' ? nom.trim() : originalBaseName;
  
  // Nettoie le nom de base
  baseName = sanitizeFilename(baseName);
  
  // Si le nom nettoyé est trop court, utilise une partie du nom original
  if (baseName.length < 3) {
    baseName = sanitizeFilename(originalBaseName).substring(0, 20);
  }
  
  return `${baseName}-${timestamp}-${randomString}.${extension}`;
}

async function createFolderStructure(parent: string, nom: string): Promise<string> {
  let targetDir: string;
  
  if (!nom || nom.trim() === '') {
    return UPLOAD_DIR;
  }
  
  // 🔧 Nettoie le nom du dossier aussi
  const nomTrimmed = sanitizeFilename(nom.trim());
  
  if (parent && parent.trim() !== '') {
    const parentTrimmed = sanitizeFilename(parent.trim());
    targetDir = join(UPLOAD_DIR, parentTrimmed, nomTrimmed);
  } else {
    targetDir = join(UPLOAD_DIR, nomTrimmed);
  }
  
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }
  
  return targetDir;
}

// ✅ Fonction pour sauvegarder dans la base de données
async function saveMediaToDatabase(
  id: string, 
  url: string, 
  filename: string, 
  type: 'etablissement' | 'chambre',
  fileType: 'image' | 'video'
) {
  try {
    if (type === 'etablissement') {
      await db.insert(mediaEtablissements).values({
        etablissementId: id,
        url: url,
        filename: filename,
        type: fileType,
      });
    } else if (type === 'chambre') {
      await db.insert(mediaChambres).values({
        chambreId: id,
        url: url,
        filename: filename,
        type: fileType,
      });
    }
    return true;
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde du média ${type}:`, error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const nom = formData.get("nom") as string;
    const id = formData.get("id") as string;
    const parent = formData.get("parent") as string;
    const type = formData.get("type") as 'etablissement' | 'chambre';
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    if (!id || !type) {
      return NextResponse.json(
        { success: false, message: 'ID et type sont requis' },
        { status: 400 }
      );
    }

    await ensureUploadDir();

    const uploadedFiles = [];
    const errors = [];
    const targetDirectory = await createFolderStructure(parent, nom);

    for (const file of files) {
      try {
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`Le fichier ${file.name} dépasse la taille maximale de 10MB`);
          continue;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
          errors.push(`Le type de fichier ${file.type} n'est pas autorisé pour ${file.name}`);
          continue;
        }
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // 🔧 Génère un nom de fichier sécurisé
        const uniqueFilename = generateUniqueFilename(nom, file.name);
        const filepath = join(targetDirectory, uniqueFilename);
        await writeFile(filepath, buffer);

        // 🔧 Corrige le chemin pour Windows/Linux
        const relativePath = filepath.replace(join(process.cwd(), 'public'), '');
        const url = relativePath.replace(/\\/g, '/');

        // ✅ Déterminer le type de média
        const fileType = file.type.startsWith('video/') ? 'video' : 'image';

        // ✅ Sauvegarder dans la base de données
        const savedToDB = await saveMediaToDatabase(id, url, uniqueFilename, type, fileType);
        
        if (!savedToDB) {
          errors.push(`Erreur lors de la sauvegarde en base de données pour ${file.name}`);
          continue;
        }

        uploadedFiles.push({
          originalName: file.name,
          sanitizedName: uniqueFilename,
          size: file.size,
          type: file.type,
          url: url,
          directory: targetDirectory,
          databaseId: id,
          mediaType: type
        });

      } catch (error) {
        console.error(`Erreur traitement ${file.name}:`, error);
        errors.push(`Erreur lors du traitement de ${file.name}: ${error}`);
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Aucun fichier n\'a pu être uploadé',
          errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedFiles.length} fichier(s) uploadé(s) avec succès`,
      data: {
        urls: uploadedFiles.map(f => f.url),
        files: uploadedFiles,
        directory: targetDirectory
      },
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Erreur upload:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur serveur lors de l\'upload',
        errors: [error]
      },
      { status: 500 }
    );
  }
}