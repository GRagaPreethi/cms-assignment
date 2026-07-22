const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Block type is required'],
      enum: ['header', 'paragraph', 'list', 'nested-list', 'table', 'equation', 'image', 'documentation', 'mixed-content'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Block data is required'],
    },
    order: {
      type: Number,
      required: [true, 'Block order is required'],
      min: 0,
    },
  },
  { _id: true }
);

const pageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Page title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    blocks: {
      type: [blockSchema],
      default: [],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster slug lookups
pageSchema.index({ slug: 1 });
pageSchema.index({ status: 1 });
pageSchema.index({ createdAt: -1 });

// Sort blocks by order before returning
pageSchema.pre('save', function (next) {
  if (this.blocks && this.blocks.length > 0) {
    this.blocks.sort((a, b) => a.order - b.order);
  }
  next();
});

// Set publishedAt when status changes to published
pageSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.isModified('status') && this.status === 'draft') {
    this.publishedAt = null;
  }
  next();
});

pageSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const Page = mongoose.model('Page', pageSchema);
module.exports = Page;
