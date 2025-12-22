"use server";
import { transporter } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const emailClient = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    // Basic validation
    if (!name || !emailClient || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClient)) {
      return NextResponse.json(
        { error: "Adresse email invalide." },
        { status: 400 }
      );
    }

    console.log(name, emailClient, message);

    const to = emailClient
    if (!to) {
      console.error("Aucun destinataire défini dans les variables d'environnement.");
      return NextResponse.json(
        { error: "Configuration serveur incomplète." },
        { status: 500 }
      );
    }

    await transporter.sendMail({
      from: process.env.MAIL_FROM_SPACE|| "",
      to,
      replyTo:to,
      subject: ` ${name} e-mail:${emailClient}`,
      html: `<div>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${emailClient}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      </div>`,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Erreur lors de l'envoi du mail:", e.message || e);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
