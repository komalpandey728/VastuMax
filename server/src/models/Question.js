const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questionText: {
      type: String,
      required: [true, 'Question content is required'],
      trim: true,
    },
    answerText: {
      type: String,
      default: '',
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: false, // Moderated by Admin before displaying publicly
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ vehicle: 1, isApproved: 1 });
questionSchema.index({ vendor: 1 });
questionSchema.index({ customer: 1 });

module.exports = mongoose.model('Question', questionSchema);
