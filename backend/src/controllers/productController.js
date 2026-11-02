import Product from '../models/Product.js';

let mockProducts = [
  {
    _id: 'prod-1',
    name: 'HKS Hi-Power Spec-L II Exhaust System',
    price: 36500,
    stock: 8,
    category: 'Exhaust',
    carCompatible: ['Honda Civic FE', 'Honda Civic FK7', 'Honda Civic FL5'],
    description: 'Titanium burnt tip exhaust system with low backpressure and signature deep aggressive Honda VTEC tone.',
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'prod-2',
    name: 'Spoon Sports Monobloc 4-Pot Caliper Kit',
    price: 52000,
    stock: 5,
    category: 'Brake Kit',
    carCompatible: ['Honda Civic FE', 'Honda Civic FK8', 'Honda City Turbo', 'Universal Honda'],
    description: 'Genuine Spoon Sports iconic anodized blue lightweight aluminum 4-piston calipers for immense stopping power.',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'prod-3',
    name: 'TEIN Flex Z Full Tap Coilovers',
    price: 29500,
    stock: 12,
    category: 'Suspension',
    carCompatible: ['Honda Civic FE', 'Honda Accord', 'Honda City Turbo', 'Honda Brio'],
    description: '16-level damping force adjustable coilover kit with ride height adjustment and twin-tube structure.',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'prod-4',
    name: 'Hondata FlashPro Tuning Module',
    price: 28000,
    stock: 15,
    category: 'ECU & Tuning',
    carCompatible: ['Honda Civic FE', 'Honda Civic FK8', 'Honda Accord 2.0T'],
    description: 'Full OBDII ECU reflashing and datalogging capability. Unleash boost targets and customized throttle response.',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'prod-5',
    name: 'Mugen Carbon Aero Rear Wing Spoiler',
    price: 44000,
    stock: 4,
    category: 'Aero & Exterior',
    carCompatible: ['Honda Civic FE', 'Honda Civic FL5 Type R'],
    description: 'Authentic Mugen dry carbon fiber multi-position adjustable downforce wing tailored specifically for Civic chassis.',
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'prod-6',
    name: 'Injen Short Ram Cold Air Intake',
    price: 18500,
    stock: 9,
    category: 'Engine & Turbo',
    carCompatible: ['Honda Civic FE', 'Honda City 1.0 Turbo', 'Honda Jazz GK'],
    description: 'Polished mandrel-bent aluminum intake pipe with high-flow nano-fiber dry filter and heat shield.',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80'
  }
];

// GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { category, search, car } = req.query;

    try {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      if (car) {
        query.carCompatible = { $in: [car] };
      }
      const products = await Product.find(query);
      if (products && products.length > 0) {
        return res.json({ success: true, count: products.length, data: products });
      }
    } catch (e) {
      // Fallback to mock
    }

    let filtered = [...mockProducts];
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    }
    if (car) {
      filtered = filtered.filter(p => p.carCompatible.some(c => c.toLowerCase().includes(car.toLowerCase())));
    }

    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      const product = await Product.findById(id);
      if (product) {
        return res.json({ success: true, data: product });
      }
    } catch (e) {
      // Fallback
    }

    const mock = mockProducts.find(p => p._id === id);
    if (!mock) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, data: mock });
  } catch (error) {
    next(error);
  }
};

// POST /api/products (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const { name, price, stock, category, carCompatible, description, imageUrl } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Please provide name, price, and category' });
    }

    try {
      const newProduct = await Product.create({
        name,
        price: Number(price),
        stock: Number(stock || 0),
        category,
        carCompatible: Array.isArray(carCompatible) ? carCompatible : (carCompatible ? carCompatible.split(',').map(s => s.trim()) : []),
        description: description || '',
        imageUrl: imageUrl || ''
      });
      return res.status(201).json({ success: true, data: newProduct });
    } catch (e) {
      const newMock = {
        _id: 'prod-' + Date.now(),
        name,
        price: Number(price),
        stock: Number(stock || 0),
        category,
        carCompatible: Array.isArray(carCompatible) ? carCompatible : ['Universal Honda'],
        description: description || '',
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
      };
      mockProducts.unshift(newMock);
      return res.status(201).json({ success: true, data: newMock });
    }
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (updated) {
        return res.json({ success: true, data: updated });
      }
    } catch (e) {
      // Fallback
    }

    const index = mockProducts.findIndex(p => p._id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    mockProducts[index] = { ...mockProducts[index], ...req.body };
    return res.json({ success: true, data: mockProducts[index] });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    try {
      await Product.findByIdAndDelete(id);
    } catch (e) {
      // Fallback
    }

    mockProducts = mockProducts.filter(p => p._id !== id);
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
