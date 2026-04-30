package com.internify.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        // This is the old method for plain text
    }

    public void sendHtmlEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true); // The 'true' flag indicates that the content is HTML
            
            mailSender.send(mimeMessage);
        } catch (Exception e) {
            System.err.println("Error sending HTML email: " + e.getMessage());
        }
    }

    public void sendApplicationStatusEmail(String studentEmail, String studentName, String opportunityTitle, String status, String type) {
        String subject = String.format("Application Update: %s", opportunityTitle);
        
        String statusMessage;
        String statusColor;
        
        if ("ACCEPTED".equals(status)) {
            statusMessage = "Congratulations! Your application has been accepted.";
            statusColor = "#22c55e"; // green
        } else if ("REJECTED".equals(status)) {
            statusMessage = "Unfortunately, your application was not selected this time.";
            statusColor = "#ef4444"; // red
        } else {
            statusMessage = String.format("Your application status has been updated to: %s", status);
            statusColor = "#3b82f6"; // blue
        }
        
        String htmlBody = String.format(
            """
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                    .status { background-color: %s; color: white; padding: 12px; border-radius: 6px; text-align: center; font-weight: bold; margin: 20px 0; }
                    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1 style="margin: 0; color: #1f2937;">Internify Platform</h1>
                        <p style="margin: 5px 0 0 0; color: #6b7280;">Application Status Update</p>
                    </div>
                    
                    <h2>Hello %s,</h2>
                    
                    <p>We have an update regarding your application for the <strong>%s</strong> %s opportunity.</p>
                    
                    <div class="status">%s</div>
                    
                    %s
                    
                    <p>Thank you for using Internify to advance your career!</p>
                    
                    <div class="footer">
                        <p>Best regards,<br>The Internify Team</p>
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            statusColor,
            studentName,
            opportunityTitle,
            type.toLowerCase(),
            statusMessage,
            "ACCEPTED".equals(status) ? 
                "<p>Please check your dashboard for next steps and contact information.</p>" :
                "<p>Don't give up! Keep exploring other opportunities on our platform.</p>"
        );
        
        sendHtmlEmail(studentEmail, subject, htmlBody);
    }
}