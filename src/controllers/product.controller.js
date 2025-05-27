const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 상품 등록
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), tags },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// 상품 목록 (검색 + 최신순 + offset 페이지네이션)
exports.getProductList = async (req, res, next) => {
  try {
    const { search = '', offset = 0, limit = 10 } = req.query;

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      skip: Number(offset),
      take: Number(limit),
      select: {
        id: true, name: true, price: true, createdAt: true
      }
    });

    res.json(products);
  } catch (err) {
    next(err);
  }
};