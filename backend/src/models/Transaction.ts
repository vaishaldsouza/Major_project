import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  txHash: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  type: 'product_purchase' | 'product_listing' | 'payment' | 'refund';
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  gasUsed?: number;
  gasPrice?: number;
  orderId?: mongoose.Types.ObjectId;
  productId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  metadata: Record<string, any>;
  createdAt: Date;
  confirmedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    txHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'ETH',
      enum: ['ETH', 'USDC', 'DAI', 'USDT'],
    },
    type: {
      type: String,
      required: true,
      enum: ['product_purchase', 'product_listing', 'payment', 'refund'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
    },
    blockNumber: {
      type: Number,
    },
    gasUsed: {
      type: Number,
    },
    gasPrice: {
      type: Number,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    confirmedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);