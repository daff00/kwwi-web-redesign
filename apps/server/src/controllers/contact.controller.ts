import { Request, Response, NextFunction } from "express";
import { ContactFormInput } from "@kwwi/shared";
import { env } from "../config/env";
import { mailer } from "../lib/mailer";

function optionalText(value: string | undefined | null) {
  return value && value.trim() ? value.trim() : "-";
}

function optionalArray(value: string[] | undefined) {
  return value && value.length ? value.join(", ") : "-";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatBodyText(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br />");
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

    const isQuote = body.formType === "get_quote";
    const subject = isQuote
      ? `New quote request from ${body.name}`
      : `New inquiry from ${body.name}`;

    const theme = {
      bg: "#F3F4F6",
      card: "#FFFFFF",
      text: "#1F2937",
      muted: "#6B7280",
      border: "#E5E7EB",
      soft: "#F9FAFB",
      accent: "#866544",
      accentSoft: "#F4F1EE",
    };

    // Note: Changed from .webp to .png for email client compatibility
    const logoUrl = new URL("/logo-brown.png", env.clientUrl).toString();
    const introTitle = isQuote ? "New Quote Request" : "New General Inquiry";
    const introText = isQuote
      ? "A customer is requesting pricing and logistics details. The summary below includes the contact and specification information provided in the form."
      : "A customer is reaching out with a general inquiry. The summary below includes the contact information and message they shared.";

    const summaryRows = [
      { label: "Name", value: body.name },
      { label: "Email", value: body.email, isLink: true },
      { label: "Phone", value: optionalText(body.phone) },
      { label: "Company", value: optionalText(body.company) },
      {
        label: isQuote ? "Request Type" : "Inquiry Type",
        value: isQuote ? "Get Quote" : "General Inquiry",
      },
    ];

    const specRows = isQuote
      ? [
          { label: "Product", value: optionalArray(body.productTypes) },
          {
            label: "Dimensions",
            value: `${optionalText(body.thickness)} x ${optionalText(body.width)} x ${optionalText(body.length)}`,
          },
          { label: "Quantity", value: optionalText(body.quantity) },
          {
            label: "Location",
            value: `${optionalText(body.country)} (${optionalText(body.port)})`,
          },
          { label: "Incoterm", value: optionalText(body.incoterm) },
          { label: "Delivery", value: optionalText(body.delivery) },
        ]
      : [
          {
            label: "Location",
            value: `${optionalText(body.country)} (${optionalText(body.port)})`,
          },
          { label: "Product", value: optionalArray(body.productTypes) },
        ];

    const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #F3EFE9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F3EFE9; padding: 48px 20px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">

            <!-- Top accent bar -->
            <tr>
              <td style="height: 4px; background-color: #866544; border-radius: 4px 4px 0 0;"></td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="background-color: #3D2B1F; padding: 32px 36px; border-radius: 0;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #CA9C60;">
                        PT Kalimas Wood Working Industry
                      </p>
                      <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700; color: #FFFFFF; line-height: 1.3;">
                        ${introTitle}
                      </h1>
                      <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.55); line-height: 1.5;">
                        ${introText}
                      </p>
                    </td>
                    <td align="right" valign="top" style="padding-left: 20px; white-space: nowrap;">
                      <span style="display: inline-block; padding: 6px 14px; background-color: #CA9C60; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 20px;">
                        ${isQuote ? "Quote Request" : "General Inquiry"}
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Card body -->
            <tr>
              <td style="background-color: #FFFFFF; padding: 36px; border: 1px solid #E8E0D5; border-top: none;">

                <!-- Contact Info Section -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #866544;">
                        Contact Information
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #EDE8E0; border-radius: 6px; overflow: hidden;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        ${summaryRows
                          .map(
                            (row, index) => `
                        <tr style="background-color: ${index % 2 === 0 ? "#FDFCFB" : "#FFFFFF"};">
                          <td width="35%" valign="top" style="padding: 11px 16px; border-bottom: ${index === summaryRows.length - 1 ? "none" : "1px solid #EDE8E0"}; color: #9A8878; font-size: 13px; font-weight: 600;">
                            ${escapeHtml(row.label)}
                          </td>
                          <td width="65%" valign="top" style="padding: 11px 16px; border-bottom: ${index === summaryRows.length - 1 ? "none" : "1px solid #EDE8E0"}; color: #2C1A0E; font-size: 13px;">
                            ${
                              row.isLink
                                ? `<a href="mailto:${escapeHtml(body.email)}" style="color: #866544; text-decoration: none; font-weight: 600;">${escapeHtml(row.value)}</a>`
                                : escapeHtml(row.value)
                            }
                          </td>
                        </tr>
                        `,
                          )
                          .join("")}
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Divider -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                  <tr>
                    <td style="height: 1px; background-color: #EDE8E0;"></td>
                  </tr>
                </table>

                <!-- Request/Inquiry Details Section -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding-bottom: 12px;">
                      <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #866544;">
                        ${isQuote ? "Request Details" : "Inquiry Details"}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="border: 1px solid #EDE8E0; border-radius: 6px; overflow: hidden;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">

                        <!-- Message row — always first, full highlight -->
                        <tr style="background-color: #FAF6F0;">
                          <td width="35%" valign="top" style="padding: 11px 16px; border-bottom: 1px solid #EDE8E0; color: #9A8878; font-size: 13px; font-weight: 600;">
                            Message
                          </td>
                          <td width="65%" valign="top" style="padding: 11px 16px; border-bottom: 1px solid #EDE8E0; color: #2C1A0E; font-size: 13px; line-height: 1.7;">
                            ${formatBodyText(body.message)}
                          </td>
                        </tr>

                        ${specRows
                          .map(
                            (row, index) => `
                        <tr style="background-color: ${index % 2 === 0 ? "#FDFCFB" : "#FFFFFF"};">
                          <td width="35%" valign="top" style="padding: 11px 16px; border-bottom: ${index === specRows.length - 1 ? "none" : "1px solid #EDE8E0"}; color: #9A8878; font-size: 13px; font-weight: 600;">
                            ${escapeHtml(row.label)}
                          </td>
                          <td width="65%" valign="top" style="padding: 11px 16px; border-bottom: ${index === specRows.length - 1 ? "none" : "1px solid #EDE8E0"}; color: #2C1A0E; font-size: 13px;">
                            ${escapeHtml(row.value)}
                          </td>
                        </tr>
                        `,
                          )
                          .join("")}

                      </table>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #3D2B1F; padding: 20px 36px; border-radius: 0 0 4px 4px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td>
                      <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.6;">
                        This message was submitted via the KWWI website contact form.
                        Reply directly to this email to respond to the sender.
                      </p>
                    </td>
                    <td align="right" valign="middle" style="padding-left: 20px; white-space: nowrap;">
                      <p style="margin: 0; font-size: 11px; font-weight: 700; color: #CA9C60; letter-spacing: 0.08em; text-transform: uppercase;">
                        KWWI
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Bottom accent bar -->
            <tr>
              <td style="height: 3px; background-color: #CA9C60; border-radius: 0 0 4px 4px;"></td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
`;

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
