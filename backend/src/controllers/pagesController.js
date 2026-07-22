const Page = require('../models/Page');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');
const slugify = require('slugify');

// @desc    Get all pages
// @route   GET /api/pages
// @access  Public (published only) / Protected (all)
const getPages = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};

    // Public request (no auth header) - only published
    if (!req.admin) {
      filter.status = 'published';
    } else if (status && ['draft', 'published'].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [pages, total] = await Promise.all([
      Page.find(filter)
        .select('-blocks')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Page.countDocuments(filter),
    ]);

    sendSuccess(res, 200, 'Pages retrieved successfully', {
      pages,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get page by slug
// @route   GET /api/pages/:slug
// @access  Public (published only) / Protected (any status)
const getPageBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const filter = { slug };

    if (!req.admin) {
      filter.status = 'published';
    }

    const pagDoc = await Page.findOne(filter).lean();
    if (!pagDoc) {
      return next(new ApiError(404, `Page with slug '${slug}' not found`));
    }

    // Sort blocks by order
    if (pagDoc.blocks) {
      pagDoc.blocks.sort((a, b) => a.order - b.order);
    }

    sendSuccess(res, 200, 'Page retrieved successfully', { page: pagDoc });
  } catch (error) {
    next(error);
  }
};

// @desc    Create page
// @route   POST /api/pages
// @access  Protected
const createPage = async (req, res, next) => {
  try {
    const { title, slug, description, status, blocks } = req.body;

    // Check for duplicate slug
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return next(new ApiError(409, `A page with slug '${slug}' already exists`));
    }

    const pageData = {
      title,
      slug,
      description: description || '',
      status: status || 'draft',
      blocks: blocks || [],
      createdBy: req.admin._id,
    };

    const newPage = await Page.create(pageData);

    sendSuccess(res, 201, 'Page created successfully', { page: newPage });
  } catch (error) {
    next(error);
  }
};

// @desc    Update page
// @route   PUT /api/pages/:id
// @access  Protected
const updatePage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, description, status, blocks } = req.body;

    const existingPage = await Page.findById(id);
    if (!existingPage) {
      return next(new ApiError(404, 'Page not found'));
    }

    // Check for duplicate slug (if slug is being changed)
    if (slug && slug !== existingPage.slug) {
      const slugExists = await Page.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        return next(new ApiError(409, `A page with slug '${slug}' already exists`));
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (blocks !== undefined) updateData.blocks = blocks;

    // Handle publishedAt
    if (status === 'published' && existingPage.status !== 'published') {
      updateData.publishedAt = new Date();
    } else if (status === 'draft') {
      updateData.publishedAt = null;
    }

    const updatedPage = await Page.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    sendSuccess(res, 200, 'Page updated successfully', { page: updatedPage });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete page
// @route   DELETE /api/pages/:id
// @access  Protected
const deletePage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const page = await Page.findById(id);
    if (!page) {
      return next(new ApiError(404, 'Page not found'));
    }

    await Page.findByIdAndDelete(id);

    sendSuccess(res, 200, 'Page deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getPages, getPageBySlug, createPage, updatePage, deletePage };
