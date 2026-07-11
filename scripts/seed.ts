import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String },
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'PUBLISHED' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });
const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  status: { type: String, default: 'PUBLISHED' },
}, { timestamps: true });
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

const seed = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('12345678', 10);

    const users = await User.insertMany([
      { name: 'Alex Rivera', email: 'alex@example.com', password: hashedPassword, image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
      { name: 'Sam Chen', email: 'sam@example.com', password: hashedPassword, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      { name: 'Jordan Taylor', email: 'jordan@example.com', password: hashedPassword, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop' }
    ]);
    console.log('Created 3 Users');

    const posts = await Post.insertMany([
      {
        title: 'The Future of Web Development in 2026: A Comprehensive Analysis',
        content: `The landscape of web development is changing rapidly. With the advent of new AI tools, writing code has never been more efficient. But what does the future hold for developers in this ever-evolving ecosystem? This article dives deep into the paradigms defining web development in 2026, analyzing how artificial intelligence, new framework paradigms, and robust styling solutions have transformed the way we build the web.

### The Rise of AI-Assisted Development
Artificial intelligence is no longer just a buzzword; it is an integrated part of our development environments. In 2026, AI assistants are embedded in every IDE, acting as pair programmers that not only suggest code snippets but architect entire modules. These agents have evolved from basic code generators to sophisticated systems capable of understanding business logic, debugging complex asynchronous workflows, and even anticipating performance bottlenecks before code is merged. This shift has drastically reduced the time spent on boilerplate code, allowing developers to focus more on user experience and architectural decisions. However, this reliance on AI also introduces new challenges. Developers must now be proficient in "prompt engineering" and critically evaluating AI-generated code to ensure it meets security and accessibility standards.

### The Next.js Dominance and Server Components
React remains the king of frontend libraries, and Next.js continues to be its primary enabler. The widespread adoption of React Server Components (RSC) has fundamentally altered how we think about rendering and data fetching. By executing code on the server and sending only the essential UI components to the client, applications in 2026 are faster and more SEO-friendly than ever before. Next.js 15+ has streamlined this process, reducing the cognitive load required to manage server and client boundaries. We see a significant shift towards edge computing, where server components are rendered globally at the edge, reducing latency to near zero. This architecture not only improves performance but also enhances security by keeping sensitive data and business logic entirely on the server.

### Tailwind CSS v4 and the Evolution of Styling
Styling has always been a contentious topic, but Tailwind CSS v4 has solidified its position as the industry standard. The introduction of the new built-in engine and directives like \`@custom-variant\` has eliminated the need for complex configuration files. Developers can now create highly responsive, deeply nested, and beautifully themed applications using pure CSS variables and utility classes. The dark mode implementation is more robust, allowing for seamless transitions and user-preferred theme detections without the flash of unstyled content (FOUC). Furthermore, Tailwind v4's performance improvements mean that build times are practically instantaneous, even for massive enterprise applications.

### WebAssembly (Wasm) and the Browser as an OS
WebAssembly has matured significantly by 2026. We are no longer limited to running JavaScript in the browser. High-performance applications, such as video editors, 3D games, and complex data visualization tools, are now written in Rust, Go, or C++ and compiled to Wasm. This brings near-native performance to web applications, blurring the line between desktop and web software. The integration between JavaScript and Wasm has become seamless, allowing developers to use the right tool for the job. 

### Security in a Post-Quantum World
With the rapid advancements in technology, security remains a paramount concern. Web development in 2026 heavily emphasizes proactive security measures. Automated AI moderators, like the one powering Ink Forge, are standard for protecting communities from toxic content and misinformation. Additionally, we are seeing the early adoption of post-quantum cryptography to secure data against future threats. Strict Content Security Policies (CSP), comprehensive input sanitization (using tools like rehype-sanitize), and secure authentication flows (such as passkeys over traditional passwords) are not just best practices but mandatory requirements for modern web applications.

### Conclusion
The future of web development is bright, driven by intelligent tools, optimized frameworks, and a relentless focus on performance and security. As developers, we must continuously adapt and embrace these new technologies to build the resilient, scalable, and user-centric applications of tomorrow. The journey has just begun, and the possibilities are limitless.`,
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
        author: users[0]._id,
        likes: [users[1]._id, users[2]._id]
      },
      {
        title: 'Why I Switched to MongoDB for My Side Projects: An In-Depth Look',
        content: `For years, I was a staunch advocate for relational databases. PostgreSQL was my go-to choice for every project, big or small. The safety of ACID compliance, the rigid structure of SQL, and the comfort of relational schemas felt like the only "right" way to build software. However, as the landscape of rapid prototyping and agile development shifted, I found myself drawn to the flexibility and speed of NoSQL. Here is the story of why I switched to MongoDB for my side projects and how it transformed my development workflow.

### The Rigidity of Relational Schemas
When building side projects, the requirements are rarely set in stone. You start with an idea, build a Minimum Viable Product (MVP), and iterate based on user feedback. In a relational database, changing the schema means writing and executing migration scripts. While tools like Prisma and TypeORM have made this process easier, it still introduces friction. Every time I wanted to add a new field or restructure a table, I had to stop coding, write a migration, and update the database. This constant context switching slowed me down and stifled creativity.

### The Freedom of NoSQL
MongoDB, on the other hand, embraces a schema-less (or schema-flexible) architecture. Documents in a collection do not have to have the exact same structure. This means I can add new fields to my data models on the fly without worrying about migrations. When I am hacking away on a weekend project, this flexibility is invaluable. I can iterate rapidly, adapting the data structure to fit the evolving needs of the application seamlessly.

### Mongoose: The Perfect Middle Ground
While total freedom is great, some structure is usually necessary to maintain data integrity. This is where Mongoose comes in. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It allows you to define schemas for your collections, providing validation, casting, and business logic hooks. 

Here is a simple example of how easy it is to define a model:
\\\`\\\`\\\`javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 18 }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
\\\`\\\`\\\`
With Mongoose, I get the best of both worlds: the flexibility of MongoDB and the structured validation of a relational database. I can define strict types where needed and leave other parts of the document open-ended.

### The Power of Aggregation
One of the common criticisms of NoSQL is that it lacks the powerful querying capabilities of SQL JOINs. While it is true that relational databases excel at highly normalized data, MongoDB's Aggregation Framework is incredibly powerful. It allows you to process data records and return computed results using a pipeline approach. Whether I need to calculate statistics, filter complex nested arrays, or even perform \\\`$lookup\\\` operations (MongoDB's version of a JOIN), the aggregation pipeline can handle it efficiently.

### Performance and Scalability
For most side projects, performance is not the primary bottleneck initially. However, it is comforting to know that MongoDB is built to scale. Its document-oriented architecture makes it naturally suited for horizontal scaling across multiple servers. Features like sharding and replica sets provide high availability and massive scalability out of the box. Even on a small scale, operations like inserting and querying JSON-like documents are incredibly fast.

### Conclusion
Switching to MongoDB has rejuvenated my passion for building side projects. The ability to move fast, adapt to changes, and use intuitive tools like Mongoose has significantly improved my productivity. While PostgreSQL will always have its place in applications requiring complex transactions and strict relational data integrity, MongoDB has proven to be the perfect companion for rapid, agile development. If you haven't tried it yet, I highly recommend giving it a spin on your next weekend project.`,
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        author: users[1]._id,
        likes: [users[0]._id]
      },
      {
        title: 'Mastering Tailwind CSS v4: The Ultimate Guide to Modern Styling',
        content: `Tailwind CSS has fundamentally changed how we write styles for the web. By providing a utility-first approach, it allows developers to build custom designs rapidly without leaving their HTML. With the release of Tailwind CSS v4, the framework has taken a massive leap forward, introducing a new engine, improved syntax, and powerful features that make styling even more intuitive. This comprehensive guide will walk you through the key updates and how to master Tailwind v4 in your projects.

### The New Oxide Engine
The most significant change in Tailwind v4 is the introduction of the Oxide engine. Written in Rust, this new engine is blazingly fast. Build times have been slashed, making the developer experience smoother than ever. Whether you are working on a small blog or a massive enterprise application, the near-instantaneous hot module replacement (HMR) keeps you in the flow. This performance boost is not just a nice-to-have; it fundamentally changes how quickly you can iterate on designs.

### Zero Configuration and Native CSS Integration
Gone are the days of complex \\\`tailwind.config.js\\\` files. Tailwind v4 embraces a zero-configuration approach, leveraging native CSS variables and directives. You can now define your entire design system directly in your CSS file using the \\\`@theme\\\` directive.

\\\`\\\`\\\`css
@import "tailwindcss";

@theme {
  --color-primary: #4f46e5;
  --font-sans: 'Inter', sans-serif;
}
\\\`\\\`\\\`
This integration makes it incredibly easy to manage themes and dynamic variables. By relying on CSS variables, Tailwind seamlessly bridges the gap between utility classes and traditional CSS architecture.

### Advanced Custom Variants
One of the most powerful features introduced is the \\\`@custom-variant\\\` directive. This allows you to define complex, reusable variants directly in your CSS, without needing to write a plugin.

For example, implementing a robust dark mode is now simpler than ever:
\\\`\\\`\\\`css
@custom-variant dark (&:is(.dark *));
\\\`\\\`\\\`
This directive creates a \\\`dark:\\\` variant that applies whenever a parent element has the \\\`dark\\\` class. You can use this to create custom states for hovering, focus, or even deeply nested parent-child relationships, keeping your HTML clean and your styling logic centralized.

### Container Queries and Logical Properties
Tailwind v4 brings first-class support for container queries and logical properties. Container queries allow you to style elements based on the size of their parent container rather than the viewport, enabling truly modular and reusable components. Logical properties (like \\\`padding-inline\\\` instead of \\\`padding-left\\\` and \\\`padding-right\\\`) make it easier to build layouts that support multiple languages and reading directions (LTR and RTL) out of the box.

### The Ecosystem and Plugins
The ecosystem surrounding Tailwind continues to grow. The official Typography plugin (\\\`@tailwindcss/typography\\\`) remains essential for styling markdown and rich text content. With v4, these plugins have been updated to integrate seamlessly with the new engine, providing even better performance and customization options.

### Conclusion
Tailwind CSS v4 is not just an incremental update; it is a reinvention of the utility-first paradigm. By embracing native CSS features, improving performance with the Oxide engine, and introducing powerful tools like \\\`@custom-variant\\\`, Tailwind has solidified its position as the premier styling solution for modern web development. Mastering these new features will allow you to build beautiful, responsive, and highly maintainable user interfaces faster than ever before.`,
        coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
        author: users[2]._id,
        likes: [users[0]._id, users[1]._id]
      },
      {
        title: 'The Art of Writing Clean Code: Principles for Longevity',
        content: `Clean code is not just a luxury; it is a necessity for sustainable software development. As projects grow in complexity, the ability to read, understand, and modify existing code becomes the primary bottleneck for engineering teams. Writing clean code is about empathy—empathy for your future self and empathy for the developers who will inherit your work. In this extensive guide, we will explore the fundamental principles of writing clean code and how to apply them in your daily practice.

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler

### Meaningful Names
The most fundamental aspect of clean code is naming. Variables, functions, and classes should have names that clearly reveal their intent. If a name requires a comment to explain what it does, the name is not good enough.

- **Use Intention-Revealing Names:** Instead of \\\`let d;\\\` (elapsed time in days), use \\\`let elapsedTimeInDays;\\\`.
- **Avoid Disinformation:** Do not use words that have entrenched meanings unless you mean them. For example, do not name a variable \\\`accountList\\\` unless it is actually a List data structure; use \\\`accounts\\\` instead.
- **Make Meaningful Distinctions:** If you have \\\`ProductInfo\\\` and \\\`ProductData\\\`, the distinction is meaningless. Choose one clear naming convention and stick to it.

### Functions Should Do One Thing
Functions are the building blocks of any program. A function should be small and do exactly one thing. If a function is performing multiple tasks—such as fetching data, parsing it, and updating the UI—it is doing too much.

- **Keep Them Small:** A function should ideally be no longer than 20 lines. If it gets longer, look for ways to extract smaller helper functions.
- **One Level of Abstraction:** The statements within a function should all be at the same level of abstraction. Mixing high-level concepts with low-level implementation details makes the code hard to read.
- **Fewer Arguments:** The ideal number of arguments for a function is zero (niladic). Next comes one (monadic), followed closely by two (dyadic). Three arguments (triadic) should be avoided where possible.

### Comments: A Necessary Evil
Comments should be used sparingly. In an ideal world, the code itself is so expressive that comments are unnecessary. When you find yourself writing a comment to explain what the code is doing, ask yourself if you can refactor the code to make it obvious.

- **Explain Why, Not What:** If you must use a comment, use it to explain the reasoning behind a decision (the "why"), not to describe the mechanics of the code (the "what").
- **Avoid Noise Comments:** Comments like \\\`// Default constructor\\\` add no value and only clutter the file.

### Error Handling
Error handling is crucial, but it should not obscure the logic of the happy path. 
- **Use Exceptions:** Instead of returning error codes, throw exceptions. This separates the error-handling logic from the main business logic.
- **Don't Return Null:** Returning null forces the caller to check for nulls, leading to verbose and error-prone code. Return an empty collection or a Special Case object instead.

### Conclusion
Writing clean code is a continuous practice. It requires discipline, constant refactoring, and a commitment to craftsmanship. By adhering to these principles—meaningful names, small functions, minimal comments, and robust error handling—you create software that is not only functional but also a joy to maintain.`,
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
        author: users[0]._id,
        likes: []
      },
      {
        title: 'Designing with Dark Mode in Mind: Aesthetics and Accessibility',
        content: `Dark mode is no longer an optional feature; it is a fundamental requirement for modern applications. Users have come to expect the ability to toggle between light and dark themes to reduce eye strain, save battery life on OLED screens, and simply enjoy a different aesthetic. However, designing for dark mode is not as simple as inverting colors. It requires a thoughtful approach to contrast, depth, and accessibility. This deep dive will explore best practices for designing exceptional dark mode experiences.

### Avoid Pure Black and Pure White
One of the most common mistakes in dark mode design is using pure black (\\\`#000000\\\`) for backgrounds and pure white (\\\`#FFFFFF\\\`) for text. This creates a stark, high-contrast environment that can cause halation (a blurring effect) and eye fatigue, defeating the purpose of dark mode.

- **Backgrounds:** Instead of pure black, use dark grays or deep desaturated colors (e.g., \\\`#121212\\\` or \\\`#0F172A\\\`). These colors are softer on the eyes and allow you to use shadows and elevation effectively.
- **Text:** Use off-white or light gray (e.g., \\\`#E2E8F0\\\`) for primary text. Reserve pure white for high-emphasis elements or icons.

### Creating Depth and Elevation
In a light theme, we often use shadows to create a sense of depth and hierarchy, separating foreground elements from the background. In a dark theme, shadows are less visible.

- **Lighter Surfaces:** To communicate elevation in dark mode, use lighter shades of your background color. The closer a surface is to the user (e.g., a modal or dropdown), the lighter the surface color should be.
- **Subtle Borders:** Sometimes, even with lighter surfaces, edges can blend together. Using a very subtle border (e.g., \\\`rgba(255, 255, 255, 0.1)\\\`) can help define the boundaries of a component without being distracting.

### Color Contrast and Accessibility
Accessibility should never be compromised for aesthetics. The contrast ratio between text and its background must meet WCAG guidelines (at least 4.5:1 for normal text).

- **Desaturate Primary Colors:** The vibrant, highly saturated brand colors that look great on a light background will often vibrate visually against a dark background, causing eye strain. Desaturate your primary colors for the dark theme to make them more legible and pleasing.
- **Test Your Colors:** Always use contrast checker tools to verify that your selected colors are accessible to users with visual impairments.

### Managing State and Interactive Elements
Interactive elements like buttons, links, and form fields need distinct styling in dark mode to indicate state (hover, focus, active, disabled).

- **Focus Rings:** Ensure that focus rings are clearly visible. Using a high-contrast accent color (like a bright blue or purple) works well against dark backgrounds.
- **Disabled States:** Lower the opacity of disabled elements significantly to clearly distinguish them from active elements.

### Conclusion
Designing an effective dark mode requires deliberate choices regarding color palettes, contrast, and elevation. By avoiding extreme contrasts, thoughtfully applying elevation, and ensuring accessibility, you can create a dark theme that is not only visually stunning but also provides a superior, comfortable user experience. Treat dark mode as a first-class citizen in your design system, and your users will thank you.`,
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
        author: users[1]._id,
        likes: [users[2]._id]
      }
    ]);
    console.log('Created 5 Posts');

    const comments = await Comment.insertMany([
      { content: 'This is a fantastic analysis of the current state of web development. I completely agree about the impact of AI and Next.js. The shift towards Server Components has fundamentally changed how we architect applications.', author: users[1]._id, post: posts[0]._id },
      { content: 'Great insights! I was hesitant to move away from SQL, but Mongoose really bridges the gap. The aggregation pipeline feature is a lifesaver for complex queries.', author: users[2]._id, post: posts[1]._id },
      { content: 'Tailwind v4 is an absolute game changer. The new @custom-variant directive is exactly what we needed to handle complex theming logic without bloated config files.', author: users[0]._id, post: posts[2]._id }
    ]);
    console.log('Created 3 Comments');

    await Post.findByIdAndUpdate(posts[0]._id, { $push: { comments: comments[0]._id } });
    await Post.findByIdAndUpdate(posts[1]._id, { $push: { comments: comments[1]._id } });
    await Post.findByIdAndUpdate(posts[2]._id, { $push: { comments: comments[2]._id } });
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seed();
