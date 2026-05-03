import { Request, Response, NextFunction } from "express";
import { ContactFormInput } from "@kwwi/shared";
import { supabase } from "../lib/supabase";
import { mailer } from "../lib/mailer";

function optionalText(value: string | undefined | null) {
  return value && value.trim() ? value.trim() : "-";
}

function optionalArray(value: string[] | undefined) {
  return value && value.length ? value.join(", ") : "-";
}

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const body = req.body as ContactFormInput;

    const recipient = process.env.CONTACT_TO_EMAIL;
    if (!recipient) {
      throw new Error("Missing CONTACT_TO_EMAIL environment variable");
    }

    const subject =
      body.formType === "get_quote"
        ? `New quote request from ${body.name}`
        : `New inquiry from ${body.name}`;

    const html = `
      <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #3D2B1F; max-width: 600px; background-color: #FCF9F5; padding: 24px; border-radius: 12px; border: 1px solid #E5D8C4; box-shadow: 0 4px 12px rgba(61, 43, 31, 0.05);">
  
  <h2 style="color: #866544; margin-top: 0; margin-bottom: 20px; font-size: 24px; border-bottom: 2px solid #E5D8C4; padding-bottom: 12px;">
    ${subject}
  </h2>

  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
    <tbody>
      <!-- Row Helper: Modern labels use a subtle background or bolded treatment without heavy borders -->
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; width: 35%; vertical-align: top;">
          <strong style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #866544;">Form Type</strong>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top;">
          ${body.formType === "get_quote" ? "Get Quote" : "General Inquiry"}
        </td>
      </tr>
      
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top;">
          <strong style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #866544;">Name</strong>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top;">
          ${body.name}
        </td>
      </tr>

      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top;">
          <strong style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #866544;">Company</strong>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top;">
          ${optionalText(body.company)}
        </td>
      </tr>

      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top;">
          <strong style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #866544;">Email</strong>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top;">
          <a href="mailto:${body.email}" style="color: #866544; text-decoration: none; font-weight: 500;">${body.email}</a>
        </td>
      </tr>

      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top;">
          <strong style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #866544;">Specs & Logistics</strong>
        </td>
        <td style="padding: 12px 8px; border-bottom: 1px solid #E5D8C4; vertical-align: top; line-height: 1.6;">
          <div style="margin-bottom: 4px;"><strong>Product:</strong> ${optionalArray(body.productTypes)}</div>
          <div style="margin-bottom: 4px;"><strong>Dimensions:</strong> ${optionalText(body.thickness)} x ${optionalText(body.width)} x ${optionalText(body.length)}</div>
          <div style="margin-bottom: 4px;"><strong>Quantity:</strong> ${optionalText(body.quantity)}</div>
          <div><strong>Location:</strong> ${optionalText(body.country)} (${optionalText(body.port)})</div>
        </td>
      </tr>

      <tr>
        <td colspan="2" style="padding: 20px 8px 8px 8px; vertical-align: top;">
          <strong style="display: block; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #866544;">Message</strong>
          <div style="background-color: #F0EAE0; padding: 16px; border-radius: 8px; line-height: 1.6; font-style: italic;">
            ${body.message.replace(/\n/g, "<br />")}
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 24px; font-size: 12px; color: #A89581; text-align: center;">
    Incoterm: ${optionalText(body.incoterm)} | Delivery: ${optionalText(body.delivery)}
  </div>
</div>
    `;

    const { error: logError } = await supabase
      .from("contact_submissions")
      .insert({
        form_type: body.formType,
        name: body.name,
        company: body.company || null,
        email: body.email,
        phone: body.phone || null,
        country: body.country || null,
        port: body.port || null,
        product_types: body.productTypes || [],
        custom_spec: body.customSpec || null,
        thickness: body.thickness || null,
        width: body.width || null,
        length: body.length || null,
        quantity: body.quantity || null,
        delivery: body.delivery || null,
        incoterm: body.incoterm || null,
        message: body.message,
        status: "new",
      });

    if (logError) {
      throw new Error(logError.message);
    }

    await mailer.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || process.env.EMAIL_USER,
      to: recipient,
      replyTo: body.email,
      subject,
      html,
    });

    res.status(201).json({ message: "Message received. We will be in touch!" });
  } catch (err) {
    next(err);
  }
}
