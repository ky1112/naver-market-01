import bcrypt from 'bcryptjs';
const data = {
  users: [
    /*{
      name: 'John',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
    */
    {
      name: '관리자',
      email: 'admin@admin.com',
      isAdmin: true,
      password2: 'dkckdlfjs',
      userid: 'admin',
      //password: bcrypt.hashSync('123456'),
      password: '$2a$10$MG73mi.2VMlpsJ.Fmmtqy.Igg.682n2URGAGHj7mHyduNU6yYHb36',
    },
  ],

  advertise: [
    {
      user: 'admin',
      advertiseName: '광고1',
      linkUrl: 'https://www.bing.com/',
      imagePath: '/images/advertise1.jpg',
    },
  ],

  category: [
    {
      name: 'Shirts',
      slug: 'Shirts',
      tags: [
        {
          tagName: 'Red',
        },
        {
          tagName: 'Blue',
        },
        {
          tagName: 'Green',
        },
      ],
    },
    {
      name: 'Pants',
      slug: 'Pants',
      tags: [
        {
          tagName: 'Red',
        },
        {
          tagName: 'Blue',
        },
        {
          tagName: 'Green',
        },
      ],
    },
  ],

  products: [
    {
      name: 'Free Shirt',
      slug: 'free-shirt',
      category: 'Shirts',
      image: [{ imagePath: '/images/shirt1.jpg' }],
      isFeatured: true,
      featuredImage: '/images/banner1.jpg',
      price: 70,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
    },
    {
      name: 'Fit Shirt',
      slug: 'fit-shirt',
      category: 'Shirts',
      image: [{ imagePath: '/images/shirt2.jpg' }],
      isFeatured: true,
      featuredImage: '/images/banner2.jpg',
      price: 80,
      brand: 'Adidas',
      rating: 4.2,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
    },
    {
      name: 'Slim Shirt',
      slug: 'slim-shirt',
      category: 'Shirts',
      image: [{ imagePath: '/images/shirt3.jpg' }],
      price: 90,
      brand: 'Raymond',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular shirt',
    },
    {
      name: 'Golf Pants',
      slug: 'golf-pants',
      category: 'Pants',
      image: [{ imagePath: '/images/pants1.jpg' }],
      price: 90,
      brand: 'Oliver',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'Smart looking pants',
    },
    {
      name: 'Fit Pants',
      slug: 'fit-pants',
      category: 'Pants',
      image: [{ imagePath: '/images/pants2.jpg' }],
      price: 95,
      brand: 'Zara',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular pants',
    },
    {
      name: 'Classic Pants',
      slug: 'classic-pants',
      category: 'Pants',
      image: [{ imagePath: '/images/pants3.jpg' }],
      price: 75,
      brand: 'Casely',
      rating: 4.5,
      numReviews: 10,
      countInStock: 20,
      description: 'A popular pants',
    },
  ],
};
export default data;
