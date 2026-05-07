import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@kwwi/shared";

export const runtime = "nodejs";

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

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function createMailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const body = parsed.data;
    const recipient = process.env.CONTACT_TO_EMAIL;

    if (!recipient) {
      return NextResponse.json(
        { error: "Missing CONTACT_TO_EMAIL environment variable" },
        { status: 500 }
      );
    }

    const subject =
      body.formType === "get_quote"
        ? `New quote request from ${body.name}`
        : `New inquiry from ${body.name}`;

    const isQuote = body.formType === "get_quote";

    const introTitle = isQuote
      ? "A new quote request has been submitted"
      : "A new inquiry has been submitted";
    const introText = isQuote
      ? "The customer is requesting pricing and logistics details. The summary below includes the contact and specification information provided in the form."
      : "The customer is reaching out with a general inquiry. The summary below includes the contact information and message they shared.";

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
            value: `${optionalText(body.thickness)} x ${optionalText(
              body.width
            )} x ${optionalText(body.length)}`,
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
      <body style="margin: 0; padding: 0; background-color: #E0F7FF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #E0F7FF; padding: 48px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">

                <tr>
                  <td style="height: 4px; background-color: #00AAEE; border-radius: 4px 4px 0 0;"></td>
                </tr>

                <tr>
                  <td style="background-color: #0077BB; padding: 32px 36px; border-radius: 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #33BBEE;">
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
                          <span style="display: inline-block; padding: 6px 14px; background-color: #00AAEE; color: #FFFFFF; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 20px;">
                            ${isQuote ? "Quote Request" : "General Inquiry"}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #FFFFFF; padding: 36px; border: 1px solid #b3e8fb; border-top: none;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #00AAEE;">
                            Contact Information
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #b3e8fb; border-radius: 6px; overflow: hidden;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            ${summaryRows
                              .map(
                                (row, index) => `
                                <tr style="background-color: ${index % 2 === 0 ? "#f0fbff" : "#FFFFFF"};">
                                  <td width="35%" valign="top" style="padding: 11px 16px; border-bottom: ${index === summaryRows.length - 1 ? "none" : "1px solid #b3e8fb"}; color: #33BBEE; font-size: 13px; font-weight: 600;">
                                    ${escapeHtml(row.label)}
                                  </td>
                                  <td width="65%" valign="top" style="padding: 11px 16px; border-bottom: ${index === summaryRows.length - 1 ? "none" : "1px solid #b3e8fb"}; color: #000000; font-size: 13px;">
                                    ${row.isLink
                                      ? `<a href="mailto:${escapeHtml(body.email)}" style="color: #00AAEE; text-decoration: none; font-weight: 600;">${escapeHtml(row.value)}</a>`
                                      : escapeHtml(row.value)}
                                  </td>
                                </tr>
                              `
                              )
                              .join("")}
                          </table>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                      <tr>
                        <td style="height: 1px; background-color: #b3e8fb;"></td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #00AAEE;">
                            ${isQuote ? "Request Details" : "Inquiry Details"}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="border: 1px solid #b3e8fb; border-radius: 6px; overflow: hidden;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr style="background-color: #E0F7FF;">
                              <td width="35%" valign="top" style="padding: 11px 16px; border-bottom: 1px solid #b3e8fb; color: #33BBEE; font-size: 13px; font-weight: 600;">
                                Message
                              </td>
                              <td width="65%" valign="top" style="padding: 11px 16px; border-bottom: 1px solid #b3e8fb; color: #000000; font-size: 13px; line-height: 1.7;">
                                ${formatBodyText(body.message)}
                              </td>
                            </tr>

                            ${specRows
                              .map(
                                (row, index) => `
                                <tr style="background-color: ${index % 2 === 0 ? "#f0fbff" : "#FFFFFF"};">
                                  <td width="35%" valign="top" style="padding: 11px 16px; border-bottom: ${index === specRows.length - 1 ? "none" : "1px solid #b3e8fb"}; color: #33BBEE; font-size: 13px; font-weight: 600;">
                                    ${escapeHtml(row.label)}
                                  </td>
                                  <td width="65%" valign="top" style="padding: 11px 16px; border-bottom: ${index === specRows.length - 1 ? "none" : "1px solid #b3e8fb"}; color: #000000; font-size: 13px;">
                                    ${escapeHtml(row.value)}
                                  </td>
                                </tr>
                              `
                              )
                              .join("")}
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="background-color: #0077BB; padding: 20px 36px; border-radius: 0 0 4px 4px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.45); line-height: 1.6;">
                            This message was submitted via the KWWI website contact form.
                            Reply directly to this email to respond to the sender.
                          </p>
                        </td>
                        <td align="right" valign="middle" style="padding-left: 20px; white-space: nowrap;">
                          <p style="margin: 0; font-size: 11px; font-weight: 700; color: #33BBEE; letter-spacing: 0.08em; text-transform: uppercase;">
                            KWWI
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="height: 3px; background-color: #33BBEE; border-radius: 0 0 4px 4px;"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const transporter = createMailer();

    await transporter.sendMail({
      from: process.env.CONTACT_FROM_EMAIL || process.env.EMAIL_USER,
      to: recipient,
      replyTo: body.email,
      subject,
      html,
    });

    return NextResponse.json(
      { message: "Message received. We will be in touch!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("[contact] email send failed:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}