export interface GalleryImage {
  src: string
  title: string
  description: string
  details?: string
  category?: string
}

export interface Project {
  id: string
  slug: string
  title: string
  client: string
  category: string
  location: string
  year: string
  description: string
  story: string
  challenge: string
  solution: string
  mainImage: string
  images: string[]
  galleryImages?: GalleryImage[]
  tags: string[]
}

export const useProjects = () => {
  const projects: Project[] = [
    {
      id: '1',
      slug: 'adeux-burger-house',
      title: 'ADEUX Burger House',
      client: '@ADEUX',
      category: 'Product Photography',
      location: 'Beersel, Belgium',
      year: '2025',
      description: 'Capturing the essence of artisanal food through bold compositions and natural light.',
      story: 'ADEUX Burger House represents the intersection of culinary artistry and visual storytelling. Each burger is crafted with care, and our photography needed to reflect that same dedication to detail.',
      challenge: 'The challenge was to showcase food in a way that felt both appetizing and artistic—elevating fast food to fine art.',
      solution: 'Through careful lighting, composition, and attention to texture, we created images that invite viewers to not just see, but taste and feel the craftsmanship in every frame.',
      mainImage: '/images/adeux-burger.jpg',
      images: [
        '/images/adeux-burger.jpg',
        '/images/adeux-bun.jpg',
        '/images/cookies.jpg'
      ],
      galleryImages: [
        {
          src: '/images/adeux-burger.jpg',
          title: 'The Signature Burger',
          description: 'Artisanal beef patty with house-made sauce',
          details: 'Shot with natural light to emphasize texture and layers. The composition highlights the craftsmanship in every ingredient.',
          category: 'Hero Shot'
        },
        {
          src: '/images/adeux-bun.jpg',
          title: 'Fresh Baked Buns',
          description: 'Handcrafted brioche buns',
          details: 'Close-up detail photography showcasing the golden-brown crust and soft interior texture.',
          category: 'Detail'
        },
        {
          src: '/images/cookies.jpg',
          title: 'Dessert Menu',
          description: 'Homemade cookies and treats',
          details: 'Overhead composition displaying the variety and artisanal quality of the dessert offerings.',
          category: 'Flat Lay'
        },
        {
          src: '/images/panama-ice.jpg',
          title: 'Refreshments',
          description: 'Cold beverages and sides',
          details: 'Capturing the vibrant colors and refreshing appeal of the beverage selection.',
          category: 'Lifestyle'
        }
      ],
      tags: ['Food Photography', 'Commercial', 'Product', 'Branding']
    },
    {
      id: '2',
      slug: 'sweetsbydagi',
      title: 'Sweetsbydagi',
      client: '@Sweetsbydagi',
      category: 'Product Photography',
      location: 'Zaventem, Belgium',
      year: '2025',
      description: 'Delicate confections deserve delicate photography—a study in texture and color.',
      story: 'Sweetsbydagi creates handcrafted confections that are miniature works of art. Our mission was to translate that delicacy and precision into visual form.',
      challenge: 'Capturing the intricate details, subtle colors, and delicate textures of handmade sweets required a meticulous approach to lighting and composition.',
      solution: 'We employed soft, diffused lighting and macro techniques to reveal every detail—from sugar crystals to color gradients—creating images as refined as the sweets themselves.',
      mainImage: '/images/Sweetsbydagi-cookies.jpg',
      images: [
        '/images/Sweetsbydagi-cookies.jpg',
        '/images/sweetsbydagi-shooting-cookie-close.jpg',
        '/images/cookies.jpg'
      ],
      galleryImages: [
        {
          src: '/images/Sweetsbydagi-cookies.jpg',
          title: 'Artisan Cookie Collection',
          description: 'Hand-decorated cookies with intricate designs',
          details: 'Overhead composition highlighting the variety and artistic detail of each handcrafted cookie.',
          category: 'Flat Lay'
        },
        {
          src: '/images/sweetsbydagi-shooting-cookie-close.jpg',
          title: 'Macro Detail',
          description: 'Close-up of cookie texture',
          details: 'Macro photography revealing the fine details, textures, and craftsmanship in each piece.',
          category: 'Detail'
        },
        {
          src: '/images/cookies.jpg',
          title: 'Product Range',
          description: 'Full collection display',
          details: 'Showcasing the complete product range with elegant styling and soft natural light.',
          category: 'Product'
        },
        {
          src: '/images/adeux-burger.jpg',
          title: 'Brand Collaboration',
          description: 'Cross-brand creative shoot',
          details: 'Collaborative work exploring the intersection of different culinary arts.',
          category: 'Editorial'
        }
      ],
      tags: ['Product Photography', 'Food', 'Luxury', 'Detail']
    },
    {
      id: '3',
      slug: 'panama-stories',
      title: 'Panama Stories',
      client: 'Personal Project',
      category: 'Reportage',
      location: 'Panama City, Panama',
      year: '2024',
      description: 'Documentary work that captures the vibrant soul of Central America.',
      story: 'A journey through Panama—from bustling markets to quiet coastal villages. This project explores the contrast between urban energy and natural serenity.',
      challenge: 'Capturing authentic moments in a fast-paced, ever-changing environment while respecting the subjects and their stories.',
      solution: 'By immersing ourselves in local communities and building trust, we were able to document genuine moments that reveal the spirit of Panama—unfiltered and honest.',
      mainImage: '/images/panama-totoche.jpg',
      images: [
        '/images/panama-totoche.jpg',
        '/images/panama-ice.jpg',
        '/images/panama-jump.jpg'
      ],
      galleryImages: [
        {
          src: '/images/panama-totoche.jpg',
          title: 'Street Portrait',
          description: 'Local character in Panama City',
          details: 'Environmental portrait capturing the personality and spirit of a Panama City resident in their natural setting.',
          category: 'Portrait'
        },
        {
          src: '/images/panama-ice.jpg',
          title: 'Market Life',
          description: 'Daily commerce and culture',
          details: 'Documenting the vibrant energy of local markets, where culture and commerce intersect.',
          category: 'Reportage'
        },
        {
          src: '/images/panama-jump.jpg',
          title: 'Coastal Energy',
          description: 'Movement and freedom',
          details: 'Action shot capturing the energy and freedom of coastal life in Panama.',
          category: 'Action'
        },
        {
          src: '/images/panama-walk.jpg',
          title: 'Urban Journey',
          description: 'Everyday moments',
          details: 'Candid documentation of daily life, capturing the rhythm and pace of the city.',
          category: 'Documentary'
        }
      ],
      tags: ['Reportage', 'Travel', 'Documentary', 'Culture']
    }
  ]

  const getProjects = () => projects

  const getProjectBySlug = (slug: string) => {
    return projects.find(p => p.slug === slug)
  }

  const getFeaturedProjects = () => {
    return projects.slice(0, 3)
  }

  return {
    getProjects,
    getProjectBySlug,
    getFeaturedProjects
  }
}
