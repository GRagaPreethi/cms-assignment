const Page = require('../models/Page');
const ApiError = require('../utils/ApiError');
const { sendSuccess } = require('../utils/response');

// @desc    Add block to a page
// @route   POST /api/blocks
// @access  Protected
const createBlock = async (req, res, next) => {
  try {
    const { pageId, type, data, order } = req.body;

    const page = await Page.findById(pageId);
    if (!page) {
      return next(new ApiError(404, 'Page not found'));
    }

    // Shift existing blocks at or above the given order
    page.blocks = page.blocks.map((block) => {
      if (block.order >= order) {
        block.order += 1;
      }
      return block;
    });

    page.blocks.push({ type, data, order });
    page.blocks.sort((a, b) => a.order - b.order);

    await page.save();

    const newBlock = page.blocks[page.blocks.findIndex((b) => b.order === order && b.type === type)];

    sendSuccess(res, 201, 'Block created successfully', { block: newBlock, page });
  } catch (error) {
    next(error);
  }
};

// @desc    Update block within a page
// @route   PUT /api/blocks/:id
// @access  Protected
const updateBlock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, data, order } = req.body;

    const page = await Page.findOne({ 'blocks._id': id });
    if (!page) {
      return next(new ApiError(404, 'Block not found'));
    }

    const blockIndex = page.blocks.findIndex((b) => b._id.toString() === id);
    if (blockIndex === -1) {
      return next(new ApiError(404, 'Block not found'));
    }

    if (type !== undefined) page.blocks[blockIndex].type = type;
    if (data !== undefined) page.blocks[blockIndex].data = data;
    if (order !== undefined) page.blocks[blockIndex].order = order;

    page.blocks.sort((a, b) => a.order - b.order);

    await page.save();

    const updatedBlock = page.blocks.find((b) => b._id.toString() === id);

    sendSuccess(res, 200, 'Block updated successfully', { block: updatedBlock });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete block from a page
// @route   DELETE /api/blocks/:id
// @access  Protected
const deleteBlock = async (req, res, next) => {
  try {
    const { id } = req.params;

    const page = await Page.findOne({ 'blocks._id': id });
    if (!page) {
      return next(new ApiError(404, 'Block not found'));
    }

    page.blocks = page.blocks.filter((b) => b._id.toString() !== id);

    // Re-order remaining blocks
    page.blocks.sort((a, b) => a.order - b.order);
    page.blocks = page.blocks.map((block, idx) => {
      block.order = idx;
      return block;
    });

    await page.save();

    sendSuccess(res, 200, 'Block deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createBlock, updateBlock, deleteBlock };
