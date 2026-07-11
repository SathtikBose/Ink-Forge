export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-invert prose-indigo max-w-none text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Agreement to Terms</h2>
        <p>By accessing or using Ink Forge, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

        <h2>2. User Conduct</h2>
        <p>You agree not to use the platform to post content that is illegal, toxic, harassing, or spreads misinformation. Ink Forge is designed to be a safe, constructive community.</p>

        <h2>3. AI Moderation & Rejections</h2>
        <p>All user-generated content is subject to review by our AI Moderation System. The AI makes automated decisions to reject content deemed toxic or harmful. By using Ink Forge, you acknowledge and agree that your content may be rejected or removed automatically based on these safety guidelines.</p>

        <h2>4. Intellectual Property</h2>
        <p>You retain the rights to the content you create on Ink Forge. By posting content, you grant us a non-exclusive license to use, reproduce, and display it in connection with the service.</p>

        <h2>5. Termination</h2>
        <p>We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

        <h2>6. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact Ink Forge Support.</p>
      </div>
    </div>
  );
}
