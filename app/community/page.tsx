'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Users, MessageSquare, Heart, Trophy, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { label: 'Active Sellers', value: '2,500+', icon: Users, color: 'blue' },
  { label: 'Monthly Posts', value: '5,000+', icon: MessageSquare, color: 'purple' },
  { label: 'Success Stories', value: '500+', icon: Trophy, color: 'amber' },
  { label: 'Community Events', value: '50+', icon: Sparkles, color: 'pink' },
];

const forumCategories = [
  {
    title: 'General Discussion',
    description: 'Connect with other sellers and share experiences',
    posts: 1240,
    icon: MessageSquare,
    color: 'blue',
  },
  {
    title: 'Getting Started',
    description: 'New to Koopi? Get help from experienced sellers',
    posts: 856,
    icon: Sparkles,
    color: 'green',
  },
  {
    title: 'Marketing Tips',
    description: 'Share strategies for growing your business',
    posts: 632,
    icon: TrendingUp,
    color: 'purple',
  },
  {
    title: 'Success Stories',
    description: 'Celebrate wins and inspire others',
    posts: 445,
    icon: Trophy,
    color: 'amber',
  },
  {
    title: 'Feature Requests',
    description: 'Suggest improvements and vote on ideas',
    posts: 298,
    icon: Heart,
    color: 'pink',
  },
  {
    title: 'Technical Help',
    description: 'Get assistance with technical issues',
    posts: 721,
    icon: Users,
    color: 'red',
  },
];

const featuredPosts = [
  {
    author: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    title: 'How I made my first LKR 100,000 in 30 days',
    excerpt: 'Sharing my journey from zero to success with Koopi. Here are the 5 strategies that worked for me...',
    category: 'Success Stories',
    likes: 124,
    replies: 38,
    time: '2 hours ago',
  },
  {
    author: 'Michael Santos',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'Best practices for product photography on a budget',
    excerpt: 'You don\'t need expensive equipment to take stunning product photos. I\'ll show you my setup...',
    category: 'Marketing Tips',
    likes: 89,
    replies: 24,
    time: '5 hours ago',
  },
  {
    author: 'Priya Patel',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    title: 'Using discount codes to boost sales during holidays',
    excerpt: 'My proven strategy for creating irresistible promotions that convert...',
    category: 'Marketing Tips',
    likes: 156,
    replies: 42,
    time: '1 day ago',
  },
];

const getColorClasses = (color: string) => {
  const colors: { [key: string]: { bg: string; text: string; icon: string } } = {
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: 'text-blue-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', icon: 'text-purple-500' },
    green: { bg: 'bg-green-500/10', text: 'text-green-600', icon: 'text-green-500' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: 'text-amber-500' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-600', icon: 'text-pink-500' },
    red: { bg: 'bg-red-500/10', text: 'text-red-600', icon: 'text-red-500' },
  };
  return colors[color] || colors.blue;
};

export default function Community() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Koopi Community</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect, Learn, and <span className="text-purple-500">Grow Together</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Join thousands of entrepreneurs sharing tips, celebrating wins, and supporting each other on their e-commerce journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-600 transition-all shadow-lg active:scale-95"
              >
                Join the Community
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg active:scale-95"
              >
                Browse Forums
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const colors = getColorClasses(stat.color);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="backdrop-blur-xl bg-white/70 rounded-[20px] border border-white/30 shadow-xl p-6 text-center"
                >
                  <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Forum Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Forum Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forumCategories.map((category, index) => {
              const colors = getColorClasses(category.color);
              return (
                <motion.a
                  key={index}
                  href="#"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group backdrop-blur-xl bg-white/70 rounded-[20px] border border-white/30 shadow-xl p-6 hover:shadow-2xl transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center mb-4`}>
                    <category.icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-500 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                  <div className="text-xs text-gray-500">{category.posts} posts</div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Trending Discussions</h2>
          <div className="space-y-4">
            {featuredPosts.map((post, index) => (
              <motion.a
                key={index}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group block backdrop-blur-xl bg-white/70 rounded-[20px] border border-white/30 shadow-xl p-6 hover:shadow-2xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-500 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-semibold">{post.author}</span>
                          <span>•</span>
                          <span>{post.time}</span>
                          <span>•</span>
                          <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.replies} replies</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center backdrop-blur-xl bg-gradient-to-r from-purple-500 to-blue-600 rounded-[24px] p-12 shadow-2xl">
          <Users className="w-16 h-16 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Join our growing community
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            Connect with fellow entrepreneurs and accelerate your success
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg active:scale-95"
          >
            Create Your Store Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
