// src/pages/api/send-sms.ts
// Serverless function for phone-first SMS funnel
// This endpoint receives phone numbers, validates them, and sends SMS via Africa's Talking API

import type { APIContext } from 'astro';
import AfricasTalking from 'africastalking';

/**
 * Sanitizes a Kenyan phone number from local format (07...) to international format (+254...)
 * @param phone - Phone number in local format (e.g., "0712345678")
 * @returns International format (e.g., "+254712345678") or null if invalid
 */
function sanitizePhoneNumber(phone: string): string | null {
  // Remove all whitespace and non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Validate: must start with 0 and be exactly 10 digits
  if (!cleaned.startsWith('0') || cleaned.length !== 10) {
    return null;
  }

  // Convert to international format: replace leading 0 with +254
  const international = '+254' + cleaned.substring(1);
  
  return international;
}

/**
 * POST handler for SMS opt-in form
 */
export async function POST({ request }: APIContext) {
  console.log("--- DEBUGGING ENV VARIABLES ---");
  console.log("Username:", import.meta.env.AFRICAS_TALKING_USERNAME);
  console.log("API Key:", import.meta.env.AFRICAS_TALKING_API_KEY);
  console.log("---------------------------------");

  try {
    // Parse incoming JSON body
    const body = await request.json();
    const { phoneNumber, smsConsent } = body;

    // ========================================
    // VALIDATION: Phone Number
    // ========================================
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Phone number is required.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // VALIDATION: SMS Consent (Compliance)
    // ========================================
    // Never trust the client. Backend must enforce consent for Kenya DPA compliance.
    if (smsConsent !== true) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'You must consent to receive SMS messages.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // PHONE NUMBER SANITIZATION
    // ========================================
    const sanitizedPhone = sanitizePhoneNumber(phoneNumber);

    if (!sanitizedPhone) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid phone number format. Please use format: 07XXXXXXXX',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ========================================
    // AFRICA'S TALKING API CALL
    // ========================================
    try {
      // Initialize Africa's Talking SDK
      const credentials = {
        apiKey: import.meta.env.AFRICAS_TALKING_API_KEY,
        username: import.meta.env.AFRICAS_TALKING_USERNAME,
      };
      const africasTalking = AfricasTalking(credentials);
      const sms = africasTalking.SMS;

      // Set SMS options
      const options = {
        to: sanitizedPhone,
        message: "Here's your FREE 5-Day Fitness Kickstart: https://drive.google.com/file/d/1dbLnoI6I4riZSsmLZJnbsqL6rpQGbocU/view?usp=drive_link",
        // Optional: Add sender ID if you have one approved
        // from: 'YourBrand'
      };

      // Send the SMS
      const response = await sms.send(options);
      console.log('Africa\'s Talking response:', response);

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Success! Check your SMS.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );

    } catch (smsError) {
      // Africa's Talking API error
      console.error('Africa\'s Talking API error:', smsError);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Something went wrong. Please try again.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    // General error (e.g., malformed JSON, unexpected issues)
    console.error('Server error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Something went wrong. Please try again.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/**
 * Reject non-POST requests
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Method not allowed. This endpoint only accepts POST requests.',
    }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  );
}

