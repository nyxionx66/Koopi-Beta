# Deployment Guide: Vercel & Netlify

This guide provides instructions for deploying your Next.js application to either Vercel or Netlify.

---

## Prerequisites

1.  **Push to a Git Repository:** Your project's code must be in a Git repository (e.g., GitHub, GitLab, Bitbucket).
2.  **Environment Variables:** Make sure you have all your necessary environment variables from your `.env.local` file ready. You will need to add these to your deployment platform's dashboard.

---

## Option 1: Deploying to Vercel (Recommended)

Vercel is the creator of Next.js and offers a highly optimized, zero-configuration deployment experience.

### Steps:

1.  **Sign up for Vercel:** Go to [vercel.com](https://vercel.com) and sign up with your Git provider account.
2.  **Import Your Project:**
    -   From your Vercel dashboard, click **"Add New... > Project"**.
    -   Select the Git repository for this project.
3.  **Configure Your Project:**
    -   Vercel will automatically detect that you are deploying a Next.js application and configure the build settings for you.
    -   Go to the **"Environment Variables"** section.
    -   Add all the variables from your `.env.local` file (e.g., `PAYHERE_MERCHANT_ID`, `SENDGRID_API_KEY`, etc.).
4.  **Deploy:** Click the **"Deploy"** button.

Vercel will now build and deploy your application. Once complete, you will be given a public URL.

---

## Option 2: Deploying to Netlify

Netlify is another excellent platform for deploying modern web applications.

### Steps:

1.  **Sign up for Netlify:** Go to [netlify.com](https://netlify.com) and sign up with your Git provider account.
2.  **Import Your Project:**
    -   From your Netlify dashboard, click **"Add new site > Import an existing project"**.
    -   Select your Git provider and choose the repository for this project.
3.  **Configure Your Build Settings:**
    -   Netlify should automatically detect the `next` framework. If not, you may need to set the build command to `npm run build` and the publish directory to `.next`.
4.  **Add Environment Variables:**
    -   Go to **"Site settings > Build & deploy > Environment"**.
    -   Add all the variables from your `.env.local` file.
5.  **Deploy:** Click the **"Deploy site"** button.

Netlify will build and deploy your application, providing you with a public URL once it's finished.