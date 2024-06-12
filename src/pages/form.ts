import sgMail from '@sendgrid/mail'
import type { APIRoute } from 'astro';
import sanitizeHtml from 'sanitize-html';

export const POST: APIRoute = async ({ request }) => {
    const formData = await request.formData()
    const name: string = sanitizeHtml(formData.get('name')?.toString()) 
    const email: string = sanitizeHtml(formData.get('email')?.toString())
    const message: string = sanitizeHtml(formData.get('message')?.toString())

    sgMail.setApiKey(import.meta.env.SENDGRID_API_KEY)
    const msg = {
        to: 'office@radcars.at', // Change to your recipient
        from: 'noreply@radcars.at', // Change to your verified sender
        subject: `Neue Kunden-Nachricht von: ${name}`,
        text: `Nachricht: ${message}\n\nAntwort an: ${email}\n\nMit freundlichen Grüßen,\n${name}`,
        html: `<p>Nachricht: ${message}</p><br /><p>Antwort an: ${email}</p><p>Mit freundlichen Grüßen,<br>${name}</p>`,
    }

    console.log(msg);
    try {
        await sgMail.send(msg)
        return new Response(null, { status: 200 })
    } catch (error) {
        console.error(error)
        return new Response(null, { status: 500 })
    }
}