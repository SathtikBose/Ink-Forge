export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-invert prose-indigo max-w-none text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Introduction</h2>
        <p>Welcome to Ink Forge. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our platform.</p>

        <h2>2. Information We Collect</h2>
        <p>We may collect personal information such as your name, email address, and profile picture when you register. We also collect any content you submit, including blogs and comments.</p>

        <h2>3. How We Use Your Information</h2>
        <p>Your information is used to:</p>
        <ul>
          <li>Provide and maintain the platform.</li>
          <li>Personalize your experience.</li>
          <li>Ensure community safety using our AI moderation tools.</li>
        </ul>

        <h2>4. AI Moderation</h2>
        <p>All posts and comments submitted on Ink Forge are processed by our automated AI moderation system (powered by Nvidia Llama 3.1) to detect and reject toxic content. This processing is strictly for content safety.</p>

        <h2>5. Data Security</h2>
        <p>We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.</p>

        <h2>6. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact Ink Forge Support.</p>
      </div>
    </div>
  );
}
