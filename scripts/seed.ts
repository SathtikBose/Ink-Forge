import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Assuming models are defined and we can import them or redefine them for the seed script
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

    // Clear existing
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('12345678', 10);

    // Create 3 Users
    const users = await User.insertMany([
      { name: 'Alex Rivera', email: 'alex@example.com', password: hashedPassword, image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop' },
      { name: 'Sam Chen', email: 'sam@example.com', password: hashedPassword, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
      { name: 'Jordan Taylor', email: 'jordan@example.com', password: hashedPassword, image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop' }
    ]);
    console.log('Created 3 Users');

    // Create 5 Posts
    const posts = await Post.insertMany([
      {
        title: 'The Future of Web Development in 2026',
        content: 'The landscape of web development is changing rapidly. With the advent of new AI tools, writing code has never been more efficient.\n\n### Key Takeaways\n- **AI Assistants**: They are everywhere.\n- **Frameworks**: Next.js continues to dominate the React ecosystem.\n- **Styling**: Tailwind CSS v4 brings huge performance improvements.',
        coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
        author: users[0]._id,
        likes: [users[1]._id, users[2]._id]
      },
      {
        title: 'Why I Switched to MongoDB for My Side Projects',
        content: 'For years I used PostgreSQL for everything. However, the flexibility of NoSQL and the ease of mongoose models have won me over for rapid prototyping.\n\nHere is a simple example:\n```javascript\nconst User = mongoose.model("User", schema);\n```\nIt just works!',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
        author: users[1]._id,
        likes: [users[0]._id]
      },
      {
        title: 'Mastering Tailwind CSS v4',
        content: 'Tailwind CSS v4 introduces a new `@custom-variant` directive that makes creating complex responsive and dark mode designs a breeze. \n\nNo more bloated config files. Just pure CSS awesomeness.',
        coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
        author: users[2]._id,
        likes: [users[0]._id, users[1]._id]
      },
      {
        title: 'The Art of Writing Clean Code',
        content: 'Clean code is not just about making it work. It is about making it understandable for the next developer who has to maintain it.\n\n> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." - Martin Fowler',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
        author: users[0]._id,
        likes: []
      },
      {
        title: 'Designing with Dark Mode in Mind',
        content: 'Dark mode is no longer an afterthought. It is a fundamental requirement for any modern web application. When designing for dark mode, do not just invert colors. Consider contrast, depth, and accessibility.',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
        author: users[1]._id,
        likes: [users[2]._id]
      }
    ]);
    console.log('Created 5 Posts');

    // Create Comments
    const comments = await Comment.insertMany([
      { content: 'Great insights! Next.js is definitely leading the way.', author: users[1]._id, post: posts[0]._id },
      { content: 'I agree with the NoSQL approach for fast MVPs.', author: users[2]._id, post: posts[1]._id },
      { content: 'Tailwind v4 is a game changer.', author: users[0]._id, post: posts[2]._id }
    ]);
    console.log('Created 3 Comments');

    // Update posts with comments
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
