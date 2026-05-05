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
    const theme = {
      bg: "#FFFFFF",
      text: "#1F2937",
      muted: "#6B7280",
      border: "#E5E7EB",
      soft: "#F9FAFB",
      accent: "#866544",
      accentSoft: "rgba(134, 101, 68, 0.12)",
    };

    const logoUrl = new URL("/logo-brown.webp", getBaseUrl()).toString();

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
      <div style="margin: 0; padding: 0; background: ${theme.bg};">
        <div style="max-width: 720px; margin: 0 auto; padding: 24px 16px; font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: ${theme.text};">
          <div style="background: ${theme.bg}; border: 1px solid ${theme.border}; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(17, 24, 39, 0.08);">
            <div style="padding: 28px 32px; background: linear-gradient(180deg, ${theme.soft} 0%, ${theme.bg} 100%); border-bottom: 1px solid ${theme.border};">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <img src="${logoUrl}" alt="KWWI" width="136" style="display: block; height: auto;" />
                  <div style="width: 1px; height: 32px; background: ${theme.border};"></div>
                  <div>
                    <div style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: ${theme.accent}; font-weight: 700; margin-bottom: 4px;">
                      KWWI Contact Mail
                    </div>
                    <div style="font-size: 20px; line-height: 1.2; font-weight: 700; color: ${theme.text};">
                      ${isQuote ? "Quote Request" : "General Inquiry"}
                    </div>
                  </div>
                </div>
                <div style="padding: 10px 14px; border-radius: 999px; background: ${theme.accentSoft}; color: ${theme.accent}; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">
                  ${subject}
                </div>
              </div>
            </div>

            <div style="padding: 32px;">
              <div style="margin-bottom: 24px;">
                <div style="font-size: 22px; line-height: 1.25; font-weight: 700; color: ${theme.text}; margin-bottom: 8px;">
                  ${introTitle}
                </div>
                <div style="font-size: 14px; line-height: 1.7; color: ${theme.muted};">
                  ${introText}
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr; gap: 18px; margin-bottom: 24px;">
                <div style="border: 1px solid ${theme.border}; border-radius: 16px; overflow: hidden;">
                  <div style="padding: 14px 18px; background: ${theme.soft}; border-bottom: 1px solid ${theme.border}; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${theme.accent};">
                    Contact Details
                  </div>
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
                    <tbody>
                      ${summaryRows
                        .map(
                          (row, index) => `
                            <tr>
                              <td style="padding: 14px 18px; width: 32%; border-top: ${index === 0 ? "none" : `1px solid ${theme.border}`}; color: ${theme.muted}; font-size: 13px; font-weight: 600;">
                                ${escapeHtml(row.label)}
                              </td>
                              <td style="padding: 14px 18px; border-top: ${index === 0 ? "none" : `1px solid ${theme.border}`}; color: ${theme.text}; font-size: 14px; line-height: 1.5;">
                                ${row.isLink ? `<a href="mailto:${escapeHtml(body.email)}" style="color: ${theme.accent}; text-decoration: none; font-weight: 600;">${escapeHtml(row.value)}</a>` : escapeHtml(row.value)}
                              </td>
                            </tr>
                          `
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>

                <div style="border: 1px solid ${theme.border}; border-radius: 16px; overflow: hidden;">
                  <div style="padding: 14px 18px; background: ${theme.soft}; border-bottom: 1px solid ${theme.border}; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: ${theme.accent};">
                    ${isQuote ? "Quote Details" : "Inquiry Details"}
                  </div>
                  <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
                    <tbody>
                      <tr>
                        <td style="padding: 14px 18px; width: 32%; color: ${theme.muted}; font-size: 13px; font-weight: 600; vertical-align: top;">
                          Message
                        </td>
                        <td style="padding: 14px 18px; color: ${theme.text}; font-size: 14px; line-height: 1.7; vertical-align: top;">
                          <div style="background: ${theme.soft}; border: 1px solid ${theme.border}; border-radius: 12px; padding: 16px;">
                            ${formatBodyText(body.message)}
                          </div>
                        </td>
                      </tr>
                      ${specRows
                        .map(
                          (row) => `
                            <tr>
                              <td style="padding: 14px 18px; width: 32%; color: ${theme.muted}; font-size: 13px; font-weight: 600; vertical-align: top; border-top: 1px solid ${theme.border};">
                                ${escapeHtml(row.label)}
                              </td>
                              <td style="padding: 14px 18px; color: ${theme.text}; font-size: 14px; line-height: 1.7; vertical-align: top; border-top: 1px solid ${theme.border};">
                                ${escapeHtml(row.value)}
                              </td>
                            </tr>
                          `
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center; padding-top: 4px;">
                <div style="font-size: 12px; color: ${theme.muted};">
                  Received from the KWWI website contact form.
                </div>
                <div style="font-size: 12px; color: ${theme.muted};">
                  ${isQuote ? "Priority: Quote request" : "Priority: General inquiry"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: message },
      { status: message === "Internal server error" ? 500 : 400 }
    );
  }
}
