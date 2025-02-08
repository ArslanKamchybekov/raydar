/** @type {import('next').NextConfig} */
 
module.exports = {
    experimental: {
      serverActions: {
        bodySizeLimit: '5mb',
      },
    },
    // utsf.io
    images : {
        domains : ['utfs.io', 'seo-heist.s3.amazonaws.com', 'ykyccstnnkxdmwembakk.supabase.co'],
    },
  }